// auth.js
const API_URL = 'http://localhost:3000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const authSection = document.getElementById('auth-section');
    const mainAppContent = document.getElementById('main-app-content');

    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');

    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');

    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // Status Display Elements
    const currentUserDisplay = document.getElementById('current-user-display');
    const presenceStatus = document.getElementById('presence-status');

    // Error messages
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    // Toggle between login and register forms
    showRegisterBtn.addEventListener('click', () => {
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
        loginError.style.display = 'none';
    });

    showLoginBtn.addEventListener('click', () => {
        registerFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
        registerError.style.display = 'none';
    });

    // Check login status on load
    checkLoginStatus();

    // Login logic
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            showError(loginError, 'Please enter email and password');
            return;
        }

        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;

        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            if (response.data && response.data.email) {
                // Save session
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('username', response.data.username);

                // Switch to app
                transitionToApp(response.data.username);
            }
        } catch (error) {
            console.error('Login error:', error);
            const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
            showError(loginError, msg);
        } finally {
            loginBtn.textContent = 'Sign In';
            loginBtn.disabled = false;
        }
    });

    // Register logic
    registerBtn.addEventListener('click', async () => {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        if (!username || !email || !password) {
            showError(registerError, 'Please fill in all fields');
            return;
        }

        registerBtn.textContent = 'Registering...';
        registerBtn.disabled = true;

        try {
            const response = await axios.post(`${API_URL}/register`, {
                username,
                email,
                password
            });

            if (response.data && response.data.email) {
                // Save session
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('username', response.data.username);

                // Switch to app
                transitionToApp(response.data.username);
            }
        } catch (error) {
            console.error('Registration error:', error);
            const msg = error.response?.data?.message || 'Registration failed.';
            showError(registerError, msg);
        } finally {
            registerBtn.textContent = 'Create Account';
            registerBtn.disabled = false;
        }
    });

    // Logout logic
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('email');
            localStorage.removeItem('username');

            // Switch to login
            transitionToLogin();
        });
    }

    // Helper functions
    function checkLoginStatus() {
        const email = localStorage.getItem('email');
        const username = localStorage.getItem('username');

        if (email) {
            transitionToApp(username);
        } else {
            transitionToLogin();
        }
    }

    function transitionToApp(username) {
        authSection.style.display = 'none';
        mainAppContent.style.display = 'grid'; // Originally it was grid

        if (currentUserDisplay) {
            currentUserDisplay.textContent = username || 'User';
        }

        // Ensure presence is updated logically if needed. Default is fine right now.
        if (typeof window.startCamera === 'function') {
            window.startCamera();
        }

        // อัปเดต sessionData ให้ตรงกับ user ที่ login (แก้ปัญหา email = 'guest')
        if (window.sessionData) {
            window.sessionData.email = localStorage.getItem('email') || 'guest';
            window.sessionData.username = username || 'Guest';
            console.log('👤 Session updated for user:', username);
        }

        // บันทึก session เริ่มต้นทันที เพื่อให้ข้อมูลปรากฏใน MongoDB Compass
        setTimeout(() => {
            if (typeof window.sendStatsToAPI === 'function') {
                window.sendStatsToAPI();
                console.log('💾 Initial session saved to MongoDB');
            }
        }, 2000); // รอ 2 วินาทีให้ sessionData update เสร็จก่อน
    }

    function transitionToLogin() {
        mainAppContent.style.display = 'none';
        authSection.style.display = 'block';
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';

        // Clear inputs just in case
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';

        // Stop camera if going back to login screen
        if (typeof window.stopCamera === 'function') {
            window.stopCamera();
        }
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
});
