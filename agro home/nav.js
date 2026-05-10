// nav.js - Navigation Module for AgroFarm Dashboard

const Navigation = (function() {
    // Private variables
    let currentAreaId = null;
    let areasData = null;

    // Configuration
    const config = {
        areaJsonPath: 'area.json',
        areasPage: 'areas.html',      // Areas page for header click
        recordsPage: 'records.html',
        settingsPage: 'settings.html',
        adminPage: 'admin.html'
    };

    // Generate HTML for navigation
    function generateNavHTML() {
        return `
            <div class="nav-container">
                <div class="nav-header">
                    <div class="brand">AGRO<span>FARM</span></div>
                </div>

                <ul class="nav-links">
                    <li class="nav-item">
                        <a href="#" id="areas-header-link" class="nav-header-link">
                            <i class='bx bxs-map-alt'></i> 
                            <span>Areas</span>
                        </a>
                        <a href="#" id="areas-toggle" class="has-dropdown dropdown-trigger">
                            <i class='bx bx-chevron-down dropdown-icon'></i>
                        </a>
                        <ul id="areas-submenu" class="submenu"></ul>
                    </li>
                    <li class="nav-item">
                        <a href="#" id="settings-link">
                            <i class='bx bxs-cog'></i> <span>Settings</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" id="records-link">
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
                    <i class='bx bx-tree'></i>
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

    // Handle click on individual area (Tomato Valley, Pepper Fields, etc.)
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
        document.querySelectorAll('.nav-links > li > a').forEach(a => a.classList.remove('active'));

        // Load areas.html with area parameter to show specific area
        loadAreasPage(areaId, areaName, areaFile);

        // Dispatch custom event for other modules
        const event = new CustomEvent('areaChanged', {
            detail: { areaId, areaName, areaFile }
        });
        document.dispatchEvent(event);
    }

    // Load areas.html (with optional area parameter)
    function loadAreasPage(areaId, areaName, areaFile) {
        const iframe = getMainIframe();
        if (iframe) {
            let url = config.areasPage;
            if (areaId) {
                url += `?area=${encodeURIComponent(areaId)}&name=${encodeURIComponent(areaName || '')}&file=${encodeURIComponent(areaFile || '')}`;
            }
            iframe.src = url;
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
        // Areas Header Link - click to load areas.html
        const areasHeaderLink = document.getElementById('areas-header-link');
        if (areasHeaderLink) {
            areasHeaderLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Load areas.html without any parameter (shows all areas)
                loadAreasPage();

                // Update active states
                document.querySelectorAll('.area-link').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.nav-links > li > a').forEach(a => a.classList.remove('active'));
                areasHeaderLink.classList.add('active');

                // Close dropdown submenu
                const submenu = document.getElementById('areas-submenu');
                if (submenu) submenu.classList.remove('show');
                const areasToggle = document.getElementById('areas-toggle');
                if (areasToggle) areasToggle.classList.remove('open');
            });
        }

        // Areas dropdown toggle (chevron button)
        const areasToggle = document.getElementById('areas-toggle');
        if (areasToggle) {
            areasToggle.addEventListener('click', toggleSubmenu);
        }

        // Settings link
        const settingsLink = document.getElementById('settings-link');
        if (settingsLink) {
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                const iframe = getMainIframe();
                if (iframe) iframe.src = config.settingsPage;
                // Remove active classes
                document.querySelectorAll('.area-link').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.nav-links > li > a').forEach(a => a.classList.remove('active'));
                settingsLink.classList.add('active');
                // Close submenu if open
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
                // Remove active classes
                document.querySelectorAll('.area-link').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.nav-links > li > a').forEach(a => a.classList.remove('active'));
                recordsLink.classList.add('active');
                // Close submenu if open
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
                    parent.window.location.href = 'login.html';
                }
            });
        }
    }

    function toggleSubmenu(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.toggle('open');
        const submenu = document.getElementById('areas-submenu');
        if (submenu) {
            submenu.classList.toggle('show');
        }
    }

    function getCurrentArea() {
        return currentAreaId;
    }

    function getAreasData() {
        return areasData;
    }

    async function loadAreas() {
        const data = await fetchAreas();
        if (data) {
            renderSubmenu(data);
        }
        return data;
    }

    // Initialize - generate HTML then setup
    async function init() {
        // Generate and inject HTML
        const root = document.getElementById('nav-root');
        if (root) {
            root.innerHTML = generateNavHTML();
        }

        // Setup event listeners after HTML is injected
        setupEventListeners();

        // Load areas from JSON
        await loadAreas();

        console.log('Navigation initialized with', areasData?.length || 0, 'areas');
    }

    // Public API
    return {
        init: init,
        getCurrentArea: getCurrentArea,
        getAreasData: getAreasData,
        refreshAreas: loadAreas,
        setConfig: function(newConfig) {
            Object.assign(config, newConfig);
        },
        goToAdmin: function() {
            const iframe = getMainIframe();
            if (iframe) iframe.src = config.adminPage;
        }
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navigation.init());
} else {
    Navigation.init();
}