// dashboard.js - Main Dashboard Layout (Simplified)

document.addEventListener("DOMContentLoaded", () => {
    // Define UI Components
    const Brand = `
        <div class="nav-left">
            <button id="toggle-btn"><i class='bx bx-menu'></i></button>
            <div class="brand">AGRO<span>FARM</span></div>
        </div>`;

    const UserProfile = (id, status) => `
        <div class="nav-right">
            <div class="user-profile">
                <div class="user-details">
                    <span class="user-id">Worker: ${id}</span>
                    <span class="user-status">${status}</span>
                </div>
                <i class='bx bxs-user-circle profile-icon'></i>
            </div>
        </div>`;

    // Assemble Layout - Sidebar now loads nav.html in iframe
    document.body.innerHTML = `
        <header class="top-bar">
            ${Brand}
            ${UserProfile('AF-2024', 'Online')}
        </header>

        <div class="dashboard-wrapper">
            <aside id="sidebar" class="sidebar">
                <iframe src="nav.html" id="nav-iframe" name="nav-frame"></iframe>
            </aside>

            <main class="main-content">
                <iframe src="areas.html" name="content-frame" id="dash-iframe"></iframe>
            </main>
        </div>`;

    // Sidebar collapse toggle
    const toggleBtn = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
});