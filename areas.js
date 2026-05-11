document.addEventListener("DOMContentLoaded", async () => {

    // 🔐 Login Check
    if (!localStorage.getItem("loggedInUser")) {
        window.location.href = "index.html";
        return;
    }

    const app = document.getElementById("app");

    // 🌿 Main Layout - No header HTML, just grid container
    app.innerHTML = `
        <div id="areas-grid" class="areas-grid"></div>
    `;

    const grid = document.getElementById("areas-grid");

    try {
        // 📂 Load Areas from API
        const response = await fetch('/api/areas');
        const result = await response.json();

        if (!result.success) {
            throw new Error('Failed to load areas');
        }

        const areas = result.data;
        grid.innerHTML = '';

        // 📦 Render Area Cards
        areas.forEach((area, index) => {
            const card = document.createElement("article");
            card.className = "area-card";
            card.id = `area-${area.id || index + 1}`;

            const singleCrop = area.crops && area.crops[0] ? area.crops[0] : "Unknown Crop";
            const cropImage = area.cropImage || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&h=300&fit=crop';

            card.innerHTML = `
                <div class="crop-image">
                    <img src="${cropImage}" alt="${singleCrop}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&h=300&fit=crop'">
                    <span class="crop-name-badge">${singleCrop}</span>
                    <button class="info-btn" data-area-id="${area.id}">
                        <i class='bx bx-info-circle'></i>
                    </button>
                </div>
                <div class="card-content">
                    <h2>${area.name || "Unnamed Area"}</h2>
                </div>
            `;

            // 👇 Card click - Navigate to area.html
            card.addEventListener("click", (e) => {
                if (e.target.closest('.info-btn')) {
                    return;
                }
                window.location.href = `area.html?area=${area.id}&name=${encodeURIComponent(area.name)}&file=${encodeURIComponent(area.dataFile || '')}`;
            });

            // ℹ️ Info button click - Show details card
            const infoBtn = card.querySelector('.info-btn');
            infoBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                showInfoCard(area, infoBtn);
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

    // 📊 Info Card Function - No button, reduced opacity
    async function showInfoCard(area, triggerElement) {
        const oldInfoCard = document.querySelector(".info-card-overlay");
        if (oldInfoCard) {
            oldInfoCard.remove();
        }

        try {
            const singleCrop = area.crops && area.crops[0] ? area.crops[0] : "Unknown Crop";
            const cropImage = area.cropImage || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&h=300&fit=crop';

            let details = null;

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

            const rect = triggerElement.getBoundingClientRect();

            const infoCard = document.createElement("div");
            infoCard.className = "info-card-overlay";
            infoCard.style.position = "fixed";
            infoCard.style.top = `${rect.bottom + 10}px`;
            infoCard.style.left = `${rect.left - 150}px`;
            infoCard.style.zIndex = "10000";

            infoCard.innerHTML = `
                <div class="info-card">
                    <button class="close-info-btn"><i class='bx bx-x'></i></button>
                    <div class="info-header">
                        <img src="${cropImage}" alt="${singleCrop}" onerror="this.src='https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&h=300&fit=crop'">
                        <div class="info-header-text">
                            <h3>${escapeHtml(area.name)}</h3>
                            <span class="info-crop-badge">${escapeHtml(singleCrop)}</span>
                        </div>
                    </div>
                    <div class="info-details">
                        <div class="info-row">
                            <i class='bx bx-map-pin'></i>
                            <span><strong>Location:</strong> ${escapeHtml(area.location || "Not specified")}</span>
                        </div>
                        <div class="info-row">
                            <i class='bx bx-leaf'></i>
                            <span><strong>Crop:</strong> ${escapeHtml(singleCrop)}</span>
                        </div>
                        ${details ? `
                            <div class="info-row">
                                <i class='bx bx-user'></i>
                                <span><strong>Farmer:</strong> ${escapeHtml(details.farmer || "Not specified")}</span>
                            </div>
                            <div class="info-row">
                                <i class='bx bx-ruler'></i>
                                <span><strong>Size:</strong> ${escapeHtml(details.size || "Not specified")}</span>
                            </div>
                            <div class="info-row">
                                <i class='bx bx-water'></i>
                                <span><strong>Water Source:</strong> ${escapeHtml(details.waterSource || "Not specified")}</span>
                            </div>
                            <div class="info-row">
                                <i class='bx bx-thermometer'></i>
                                <span><strong>Temperature:</strong> ${escapeHtml(details.temperature || "Not specified")}</span>
                            </div>
                            <div class="info-row">
                                <i class='bx bx-calendar'></i>
                                <span><strong>Planting Date:</strong> ${escapeHtml(details.plantingDate || "Not specified")}</span>
                            </div>
                            ${details.expectedHarvest ? `
                                <div class="info-row">
                                    <i class='bx bx-calendar-check'></i>
                                    <span><strong>Expected Harvest:</strong> ${escapeHtml(details.expectedHarvest)}</span>
                                </div>
                            ` : ''}
                        ` : ''}
                        <div class="info-row">
                            <i class='bx bx-microchip'></i>
                            <span><strong>Sensors:</strong> ${area.otherNameOfArea?.sensors?.length || 0} active</span>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(infoCard);

            // Close button
            infoCard.querySelector(".close-info-btn").addEventListener("click", () => {
                infoCard.remove();
            });

            // Click outside to close
            setTimeout(() => {
                document.addEventListener("click", function closeHandler(e) {
                    if (!infoCard.contains(e.target) && !triggerElement.contains(e.target)) {
                        infoCard.remove();
                        document.removeEventListener("click", closeHandler);
                    }
                });
            }, 100);

        } catch (error) {
            console.error("Error loading info card:", error);
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
});