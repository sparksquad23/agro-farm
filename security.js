let users = [];

// Load users from JSON file
async function loadUsers() {
    try {
        const res = await fetch("user.json");
        users = await res.json();
    } catch (error) {
        console.error("Failed to load users:", error);
    }
}

// Check credentials
function authenticate(workerId, password) {
    return users.find(user =>
        user.workerId === workerId &&
        user.password === password
    );
}

// Check login state
function isLoggedIn() {
    return localStorage.getItem("loggedInUser") !== null;
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

// Logout function
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}