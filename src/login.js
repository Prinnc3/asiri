// Form submission handling
document
    .getElementById('login-form')
    .addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simulated login response (replace with server API call)
        if (username === 'admin' && password === '1234') {
            alert('Login successful!');
            window.location.href = 'dashboard.html'; // Redirect to another page
        } else {
            document
                .getElementById('error-message')
                .classList.remove('hidden');
        }
    });

// Toggle Password Visibility
document
    .getElementById('toggle-password')
    .addEventListener('click', () => {
        const passwordField = document.getElementById('password');
        const toggleIcon = document.getElementById('toggle-password');

        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordField.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    });

// Cancel Button Logic
document
    .getElementById('cancel-button')
    .addEventListener('click', () => {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document
            .getElementById('error-message')
            .classList.add('hidden');
    });
