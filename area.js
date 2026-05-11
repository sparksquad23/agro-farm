// area.js - Area Details Page (Redesigned)

(function() {
    const root = document.getElementById('area-root');
    const urlParams = new URLSearchParams(window.location.search);
    const areaId = urlParams.get('area');
    const areaName = urlParams.get('name');

    // Generate main HTML structure
    function generateMainHTML() {
        return `<div class="area-detail-container" id="area-detail-container"></div>`;
    }

    root.innerHTML = generateMainHTML();
    const container = document.getElementById('area-detail-container');

    // Load areas data
    fetch('area.json')
        .then(response => response.json())
        .then(areas => {
            if (areaId) {
                const area = areas.find(a => a.id == areaId);
                if (area) {
                    displayAreaDetails(area);
                } else {
                    displayNotFound();
                }
            } else {
                displayAllAreas(areas);
            }
        })
        .catch(error => {
            console.error('Error loading areas:', error);
            displayError();
        });

    function displayAreaDetails(area) {
        const sensors = area.otherNameOfArea?.sensors || [];

        // Calculate averages
        let avgTemp = 0, avgWater = 0, avgPH = 0;
        sensors.forEach(sensor => {
            avgTemp += sensor.data.temperature;
            avgWater += sensor.data.waterContent;
            avgPH += sensor.data.pH;
        });
        avgTemp = sensors.length ? (avgTemp / sensors.length).toFixed(1) : 'N/A';
        avgWater = sensors.length ? (avgWater / sensors.length).toFixed(0) : 'N/A';
        avgPH = sensors.length ? (avgPH / sensors.length).toFixed(1) : 'N/A';

        // Generate sensor cards HTML
        let sensorsHTML = '';
        if (sensors.length > 0) {
            sensors.forEach(sensor => {
                sensorsHTML += `
                    <div class="sensor-card">
                        <div class="sensor-header">
                            <i class='bx bx-microchip'></i>
                            <div class="sensor-info">
                                <div class="sensor-name">${escapeHtml(sensor.name)}</div>
                                <div class="sensor-id">${escapeHtml(sensor.sensorId)}</div>
                            </div>
                        </div>
                        <div class="sensor-readings">
                            <div class="reading-row">
                                <span class="reading-label"><i class='bx bx-thermometer'></i> Temperature</span>
                                <span class="reading-value">${sensor.data.temperature}<span class="reading-unit">°C</span></span>
                            </div>
                            <div class="reading-row">
                                <span class="reading-label"><i class='bx bx-water'></i> Water Content</span>
                                <span class="reading-value">${sensor.data.waterContent}<span class="reading-unit">%</span></span>
                            </div>
                            <div class="reading-row">
                                <span class="reading-label"><i class='bx bx-lab'></i> Soil pH</span>
                                <span class="reading-value">${sensor.data.pH}<span class="reading-unit">pH</span></span>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            sensorsHTML = `
                <div class="no-sensors">
                    <i class='bx bx-microchip-off'></i>
                    <p>No sensors found for this area</p>
                </div>
            `;
        }

        container.innerHTML = `
            <!-- Header with back button at corner left -->
            <div class="area-header-section">
                <button class="back-btn" onclick="window.location.href='areas.html'">
                    <i class='bx bx-arrow-back'></i> Back to All Areas
                </button>
                <div class="area-title">
                    <i class='bx bx-map-alt'></i>
                    <h1>${escapeHtml(area.name)}</h1>
                </div>
                <div class="location-badge">
                    <i class='bx bx-map-pin'></i>
                    <span>${escapeHtml(area.location)}</span>
                </div>
            </div>
            
            <!-- Summary Section -->
            <div class="summary-section">
                <div class="summary-card">
                    <div class="summary-icon">
                        <i class='bx bx-thermometer'></i>
                    </div>
                    <div class="summary-info">
                        <h4>Average Temperature</h4>
                        <div class="summary-value">${avgTemp}<span class="summary-unit">°C</span></div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon">
                        <i class='bx bx-water'></i>
                    </div>
                    <div class="summary-info">
                        <h4>Average Water Content</h4>
                        <div class="summary-value">${avgWater}<span class="summary-unit">%</span></div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon">
                        <i class='bx bx-lab'></i>
                    </div>
                    <div class="summary-info">
                        <h4>Average pH Level</h4>
                        <div class="summary-value">${avgPH}<span class="summary-unit">pH</span></div>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon">
                        <i class='bx bx-microchip'></i>
                    </div>
                    <div class="summary-info">
                        <h4>Active Sensors</h4>
                        <div class="summary-value">${sensors.length}</div>
                    </div>
                </div>
            </div>
            
            <!-- Sensors Section -->
            <div class="sensors-section">
                <div class="sensors-header">
                    <h2>
                        <i class='bx bx-microchip'></i>
                        Sensor Readings
                    </h2>
                    <div class="sensor-count-badge">
                        ${sensors.length} Sensors Active
                    </div>
                </div>
                <div class="sensors-grid">
                    ${sensorsHTML}
                </div>
            </div>
        `;
    }

    function displayAllAreas(areas) {
        let areasHTML = '';
        areas.forEach(area => {
            const sensorCount = area.otherNameOfArea?.sensors?.length || 0;
            const cropName = area.crops && area.crops[0] ? area.crops[0] : 'Unknown';

            areasHTML += `
                <div class="area-select-card" onclick="selectArea(${area.id}, '${escapeHtml(area.name)}')">
                    <i class='bx bx-folder'></i>
                    <h3>${escapeHtml(area.name)}</h3>
                    <p><i class='bx bx-map-pin'></i> ${escapeHtml(area.location)}</p>
                    <p><i class='bx bx-leaf'></i> ${escapeHtml(cropName)}</p>
                    <div style="margin-top: 0.8rem; font-size: 0.75rem; color: #e8a735;">
                        <i class='bx bx-microchip'></i> ${sensorCount} Sensors
                    </div>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="area-header-section">
                <div class="area-title">
                    <i class='bx bx-grid-alt'></i>
                    <h1>All Agricultural Areas</h1>
                </div>
            </div>
            <div class="all-areas-grid">
                ${areasHTML}
            </div>
        `;
    }

    function displayNotFound() {
        container.innerHTML = `
            <div class="area-header-section">
                <button class="back-btn" onclick="window.location.href='areas.html'">
                    <i class='bx bx-arrow-back'></i> Back to All Areas
                </button>
            </div>
            <div class="error-state">
                <i class='bx bx-error-circle'></i>
                <h2>Area Not Found</h2>
                <p>The selected area could not be found.</p>
            </div>
        `;
    }

    function displayError() {
        container.innerHTML = `
            <div class="error-state">
                <i class='bx bx-error-circle'></i>
                <h2>Error Loading Data</h2>
                <p>Could not load area information. Please try again.</p>
            </div>
        `;
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

    // Make selectArea available globally
    window.selectArea = function(id, name) {
        window.location.href = `area.html?area=${id}&name=${encodeURIComponent(name)}`;
    };
})();