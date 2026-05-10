const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from CURRENT directory (where server.js is located)
app.use(express.static(__dirname));

// Path to area.json
const AREA_FILE = path.join(__dirname, 'area.json');

// GET - Load areas
app.get('/api/areas', async (req, res) => {
    try {
        const data = await fs.readFile(AREA_FILE, 'utf8');
        const areas = JSON.parse(data);
        res.json({ success: true, data: areas });
    } catch (error) {
        // If file doesn't exist, return default data
        const defaultAreas = [
            {
                "id": 1,
                "name": "Tomato Valley",
                "location": "North Section",
                "crops": ["Tomatoes"],
                "cropImage": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&h=300&fit=crop",
                "dataFile": "area1.json"
            },
            {
                "id": 2,
                "name": "Pepper Fields",
                "location": "East Section",
                "crops": ["Bell Peppers"],
                "cropImage": "https://images.unsplash.com/photo-1563565375008-21f6db69f1a3?w=500&h=300&fit=crop",
                "dataFile": "area2.json"
            }
        ];
        // Create default file if it doesn't exist
        await fs.writeFile(AREA_FILE, JSON.stringify(defaultAreas, null, 4), 'utf8');
        res.json({ success: true, data: defaultAreas });
    }
});

// POST - Save areas (overwrite file)
app.post('/api/areas', async (req, res) => {
    try {
        const areas = req.body;

        // Validate
        if (!Array.isArray(areas)) {
            return res.status(400).json({ success: false, error: 'Invalid data format' });
        }

        // Write to file
        await fs.writeFile(AREA_FILE, JSON.stringify(areas, null, 4), 'utf8');

        res.json({ success: true, message: `Saved ${areas.length} areas to area.json` });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ success: false, error: 'Failed to save file' });
    }
});

// Default route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📁 Main site: http://localhost:${PORT}/`);
    console.log(`📁 Admin panel: http://localhost:${PORT}/admin.html`);
    console.log(`📁 Areas view: http://localhost:${PORT}/index.html`);
});