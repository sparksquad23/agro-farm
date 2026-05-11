// nav.js - Navigation Module for AgroFarm Dashboard (Professional)

const Navigation = (function() {
    // Private variables
    let currentAreaId = null;
    let areasData = null;

    // Configuration
    const config = {
        areaJsonPath: 'area.json',
        areasPage: 'areas.html',      // For header link - shows all areas grid
        areaDetailPage: 'area.html',   // For submenu items - shows specific area with sensors
        recordsPage: 'records.html',
        settingsPage: 'settings.html',
        adminPage: 'admin.html'
    };

    // Generate HTML for navigation
    function generateNavHTML() {
        return `
            <div class="nav-container">
                

                <ul class="nav-links">
                    <li class="nav-item">
                        <div class="areas-container">
                            <div class="areas-row">
                                <a href="#" id="areas-header-link">
                                    <i class='bx bxs-map-alt'></i> 
                                    <span>Areas</span>
                                </a>
                                <button id="areas-toggle" class="dropdown-trigger">
                                    <i class='bx bx-chevron-down'></i>
                                </button>
                            </div>
                            <ul id="areas-submenu" class="submenu"></ul>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="#" id="settings-link" class="nav-link-item">
                            <i class='bx bxs-cog'></i> <span>Settings</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" id="records-link" class="nav-link-item">
                            <i class='bx bxs-folder-open'></i> <span>Records</span>
                        </a>
                    </li>
                </ul>

                <div class="nav-footer">
                    <a href="#" id="admin-link">
                        <i class='bx bx-shield-alt'></i> 
                        <span>Admin Panel</span>
                    </a>
                    <a href="#" id="logout-link">
                        <i class='bx bx-log-out'></i> 
                        <span>Sign Out</span>
                    </a>
                </div>
            </div>
        `;
    }

    // Get the main iframe from parent window
    function getMainIframe() {
        return parent.document.getElementById('dash-iframe');
    }

    // Private methods
    async function fetchAreas() {
        try {
            const response = await fetch(config.areaJsonPath);
            if (!response.ok) throw new Error('Failed to load areas');
            areasData = await response.json();
            return areasData;
        } catch (error) {
            console.error('Error loading areas:', error);
            return null;
        }
    }

    function renderSubmenu(areas) {
        const submenu = document.getElementById('areas-submenu');
        if (!submenu) return;

        submenu.innerHTML = '';

        if (!areas || areas.length === 0) {
            submenu.innerHTML = '<li class="error">No areas available</li>';
            return;
        }

        areas.forEach(area => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#" data-area-id="${area.id}" data-area-name="${escapeHtml(area.name)}" data-area-file="${escapeHtml(area.dataFile)}" class="area-link">
                    <i class='bx bx-folder'></i>
                    <span>${escapeHtml(area.name)}</span>
                </a>
            `;
            submenu.appendChild(li);
        });

        attachAreaClickHandlers();
    }

    function attachAreaClickHandlers() {
        document.querySelectorAll('.area-link').forEach(link => {
            link.removeEventListener('click', handleAreaClick);
            link.addEventListener('click', handleAreaClick);
        });
    }

    // Handle click on individual area (submenu items)
    // Loads area.html with specific area parameter
    function handleAreaClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const areaId = this.dataset.areaId;
        const areaName = this.dataset.areaName;
        const areaFile = this.dataset.areaFile;

        currentAreaId = areaId;

        // Update active state
        document.querySelectorAll('.area-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Remove active class from main nav links
        document.querySelectorAll('.nav-link-item').forEach(a => a.classList.remove('active'));
        document.getElementById('areas-header-link').classList.remove('active');

        // Load area.html with area parameter (shows specific area with sensors)
        loadAreaDetailPage(areaId, areaName, areaFile);
    }

    // Load area.html for specific area details (with sensors)
    function loadAreaDetailPage(areaId, areaName, areaFile) {
        const iframe = getMainIframe();
        if (iframe) {
            let url = `${config.areaDetailPage}?area=${encodeURIComponent(areaId)}&name=${encodeURIComponent(areaName || '')}&file=${encodeURIComponent(areaFile || '')}`;
            iframe.src = url;
        }
    }

    // Load areas.html for header click (shows all areas grid)
    function loadAreasPage() {
        const iframe = getMainIframe();
        if (iframe) {
            iframe.src = config.areasPage;
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function setupEventListeners() {
        // Areas Header Link - click to load areas.html (shows all areas grid)
        const areasHeaderLink = document.getElementById('areas-header-link');
        if (areasHeaderLink) {
            areasHeaderLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Load areas.html without parameters (shows all areas)
                loadAreasPage();

                // Update active states
                document.querySelectorAll('.area-link').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.nav-link-item').forEach(a => a.classList.remove('active'));
                areasHeaderLink.classList.add('active');

                // Close dropdown
                const submenu = document.getElementById('areas-submenu');
                if (submenu) submenu.classList.remove('show');
                const areasToggle = document.getElementById('areas-toggle');
                if (areasToggle) areasToggle.classList.remove('open');
            });
        }

        // Areas dropdown toggle (chevron button)
        const areasToggle = document.getElementById('areas-toggle');
        if (areasToggle) {
            areasToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                areasToggle.classList.toggle('open');
                const submenu = document.getElementById('areas-submenu');
                if (submenu) {
                    submenu.classList.toggle('show');
                }
            });
        }

        // Settings link
        const settingsLink = document.getElementById('settings-link');
        if (settingsLink) {
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                const iframe = getMainIframe();
                if (iframe) iframe.src = config.settingsPage;

                document.querySelectorAll('.area-link').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.nav-link-item').forEach(a => a.classList.remove('active'));
                settingsLink.classList.add('active');
                document.getElementById('areas-header-link').classList.remove('active');

                // Close dropdown
                const submenu = document.getElementById('areas-submenu');
                if (submenu) submenu.classList.remove('show');
                const areasToggleBtn = document.getElementById('areas-toggle');
                if (areasToggleBtn) areasToggleBtn.classList.remove('open');
            });
        }

        // Records link
        const recordsLink = document.getElementById('records-link');
        if (recordsLink) {
            recordsLink.addEventListener('click', (e) => {
                e.preventDefault();
                const iframe = getMainIframe();
                if (iframe) iframe.src = config.recordsPage;

                document.querySelectorAll('.area-link').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.nav-link-item').forEach(a => a.classList.remove('active'));
                recordsLink.classList.add('active');
                document.getElementById('areas-header-link').classList.remove('active');

                // Close dropdown
                const submenu = document.getElementById('areas-submenu');
                if (submenu) submenu.classList.remove('show');
                const areasToggleBtn = document.getElementById('areas-toggle');
                if (areasToggleBtn) areasToggleBtn.classList.remove('open');
            });
        }

        // Admin link
        const adminLink = document.getElementById('admin-link');
        if (adminLink) {
            adminLink.addEventListener('click', (e) => {
                e.preventDefault();
                const iframe = getMainIframe();
                if (iframe) iframe.src = config.adminPage;
            });
        }

        // Logout link
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (parent.confirm('Are you sure you want to sign out?')) {
                    parent.window.location.href = 'index.html';
                }
            });
        }
    }

    async function loadAreas() {
        const data = await fetchAreas();
        if (data) {
            renderSubmenu(data);
        }
        return data;
    }

    async function init() {
        const root = document.getElementById('nav-root');
        if (root) {
            root.innerHTML = generateNavHTML();
        }

        setupEventListeners();
        await loadAreas();

        console.log('Navigation initialized with', areasData?.length || 0, 'areas');
    }

    return {
        init: init,
        getAreasData: () => areasData,
        refreshAreas: loadAreas
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navigation.init());
} else {
    Navigation.init();
}