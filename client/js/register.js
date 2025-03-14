document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        // Email validation
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Password validation
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // TODO: Add your registration API call here
        console.log('Registration data:', {
            firstName,
            lastName,
            email,
            password
        });

        // For demonstration purposes
        alert('Registration successful!');
        // Redirect to main page
        window.location.href = 'index.html';
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}); 