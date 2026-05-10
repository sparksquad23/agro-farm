document.addEventListener("DOMContentLoaded", async () => {

    // 🔐 Login Check
    if (!localStorage.getItem("loggedInUser")) {
        window.location.href = "index.html";
        return;
    }

    const app = document.getElementById("app");

    // 🌿 Main Layout
    app.innerHTML = `
        <section class="areas-container">

            <h1>🌾 Corner Farm Areas</h1>

            <p>
                Select an area to explore farm details
            </p>

            <div id="areas-grid" class="areas-grid"></div>

        </section>
    `;

    const grid = document.getElementById("areas-grid");

    try {
        // 📂 Load Areas from API (NOT directly from file)
        const response = await fetch('/api/areas');
        const result = await response.json();

        if (!result.success) {
            throw new Error('Failed to load areas');
        }

        const areas = result.data;

        // Clear loading state
        grid.innerHTML = '';

        // 📦 Render Area Cards
        areas.forEach((area, index) => {

            const card = document.createElement("article");
            card.className = "area-card";
            card.id = `area-${area.id || index + 1}`;

            // Get the single crop
            const singleCrop = area.crops && area.crops[0] ? area.crops[0] : "Unknown Crop";

            // Set default image if none provided
            const cropImage = area.cropImage || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&h=300&fit=crop';

            card.innerHTML = `
                <div class="crop-image">
                    <img src="${cropImage}" alt="${singleCrop}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&h=300&fit=crop'">
                    <span class="crop-name-badge">${singleCrop}</span>
                </div>
                <div class="card-content">
                    <h2>${area.name || "Unnamed Area"}</h2>
                </div>
            `;

            // 👇 Make entire card clickable
            card.addEventListener("click", () => {
                openAreaModal(area);
            });

            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading areas:", error);
        grid.innerHTML = `
            <p class="error">
                ❌ Failed to load area data. Please make sure server is running.
            </p>
        `;
    }

    // 📊 Modal Function
    async function openAreaModal(area) {

        // Remove Existing Modal
        const oldModal = document.querySelector(".modal-overlay");
        if (oldModal) {
            oldModal.remove();
        }

        try {
            const singleCrop = area.crops && area.crops[0] ? area.crops[0] : "Unknown Crop";
            const cropImage = area.cropImage || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&h=300&fit=crop';

            let details = null;

            // Load area details if dataFile exists
            if (area.dataFile) {
                try {
                    const response = await fetch(area.dataFile);
                    if (response.ok) {
                        details = await response.json();
                    }
                } catch (err) {
                    console.warn(`Could not load ${area.dataFile}`);
                }
            }

            const modal = document.createElement("div");
            modal.className = "modal-overlay";

            if (!details) {
                modal.innerHTML = `
                    <div class="modal-box">
                        <button class="close-modal">✖</button>
                        <h2>${area.name}</h2>
                        <div class="modal-crop-image">
                            <img src="${cropImage}" alt="${singleCrop}">
                        </div>
                        <p class="modal-crop-name"><strong>🌱 Crop:</strong> ${singleCrop}</p>
                        <p><strong>📍 Location:</strong> ${area.location || "Not specified"}</p>
                        <hr>
                        <p class="farm-notes"><strong>📌 Notes:</strong> No additional details available.</p>
                    </div>
                `;
            } else {
                modal.innerHTML = `
                    <div class="modal-box">
                        <button class="close-modal">✖</button>
                        <h2>${area.name}</h2>
                        <div class="modal-crop-image">
                            <img src="${cropImage}" alt="${singleCrop}">
                        </div>
                        <p class="modal-crop-name"><strong>🌱 Crop:</strong> ${singleCrop}</p>
                        <p><strong>📍 Location:</strong> ${area.location || "Not specified"}</p>
                        <hr>
                        <div class="details-grid">
                            <p><strong>👨‍🌾 Farmer:</strong> ${details.farmer || "Not specified"}</p>
                            <p><strong>🧑‍💼 Manager:</strong> ${details.farmManager || "Not specified"}</p>
                            <p><strong>📏 Size:</strong> ${details.size || "Not specified"}</p>
                            <p><strong>📊 Status:</strong> ${details.status || "Active"}</p>
                            <p><strong>🌍 Soil Type:</strong> ${details.soilType || "Not specified"}</p>
                            <p><strong>💧 Water Source:</strong> ${details.waterSource || "Not specified"}</p>
                            <p><strong>🌤️ Weather:</strong> ${details.weather || "Not specified"}</p>
                            <p><strong>🌡️ Temperature:</strong> ${details.temperature || "Not specified"}</p>
                            <p><strong>👷 Workers:</strong> ${details.workers || "Not specified"}</p>
                            <p><strong>📅 Planting Date:</strong> ${details.plantingDate || "Not specified"}</p>
                            <p><strong>🚜 Expected Harvest:</strong> ${details.expectedHarvest || "Not specified"}</p>
                        </div>
                        <hr>
                        ${details.fertilizerUsed ? `
                            <h3>🧪 Fertilizers Used</h3>
                            <ul>${details.fertilizerUsed.map(item => `<li>${item}</li>`).join("")}</ul>
                        ` : ''}
                        ${details.equipment ? `
                            <h3>🛠️ Equipment</h3>
                            <ul>${details.equipment.map(item => `<li>${item}</li>`).join("")}</ul>
                        ` : ''}
                        ${details.livestockNearby ? `
                            <h3>🐄 Livestock Nearby</h3>
                            <ul>${details.livestockNearby.map(item => `<li>${item}</li>`).join("")}</ul>
                        ` : ''}
                        ${details.recentActivities ? `
                            <h3>📝 Recent Activities</h3>
                            <ul>${details.recentActivities.map(item => `<li>${item}</li>`).join("")}</ul>
                        ` : ''}
                        <hr>
                        ${details.warehouse ? `
                            <h3>🏢 Warehouse</h3>
                            <p><strong>Name:</strong> ${details.warehouse.name}</p>
                            <p><strong>Capacity:</strong> ${details.warehouse.capacity}</p>
                            <p><strong>Distance:</strong> ${details.warehouse.distance}</p>
                            <hr>
                        ` : ''}
                        ${details.images && details.images.length > 0 ? `
                            <h3>🖼️ Farm Images</h3>
                            <div class="image-gallery">
                                ${details.images.map(image => `<img src="${image}" alt="Farm Image" loading="lazy">`).join("")}
                            </div>
                            <hr>
                        ` : ''}
                        <p class="farm-notes"><strong>📌 Notes:</strong> ${details.notes || "No additional notes."}</p>
                    </div>
                `;
            }

            document.body.appendChild(modal);

            // Close button
            modal.querySelector(".close-modal").addEventListener("click", () => modal.remove());

            // Close on outside click
            modal.addEventListener("click", (e) => {
                if (e.target === modal) modal.remove();
            });

        } catch (error) {
            console.error("Error opening modal:", error);
            alert("Failed to load area details.");
        }
    }
});