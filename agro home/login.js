document.addEventListener("DOMContentLoaded", async () => {

    // Load users first
    await loadUsers();

    // Inject login UI
    document.body.innerHTML = `
<section id="Leftpanel">
    <div class="overlay"></div>
    <div class="content">
        <div class="logo">AGROFARMING</div>
        <div class="Moto">Health Farm, Health Crops</div>
    </div>
</section>

<section id="Rightpanel">
    <div class="login-container">
        <h2>Worker Login</h2>
        <p>Welcome back! Please enter your details.</p>

        <div class="input-group">
            <i class='bx bxs-user'></i>
            <input type="text" id="workerid" placeholder="Worker ID" required/>
        </div>

        <div class="input-group">
            <i class='bx bxs-lock-alt'></i>
            <input type="password" id="password" placeholder="Password" required>
        </div>

        <div class="form-options">
            <label><input type="checkbox"> Remember me</label>
            <a href="#" class="forgot-link">Forgot Password?</a>
        </div>

        <button id="loginbutton">
            <span class="btn-text">Login</span>
        </button>

        <div class="footer-text">
            Need help? <a href="#">Contact Admin</a>
        </div>
    </div>
</section>
    `;

    // Login handler
    document.getElementById("loginbutton").addEventListener("click", () => {
        const workerId = document.getElementById("workerid").value;
        const password = document.getElementById("password").value;

        const user = authenticate(workerId, password);

        if (user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid Worker ID or Password");
        }
    });
});