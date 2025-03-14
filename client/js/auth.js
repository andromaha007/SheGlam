async function registerUser(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            showLoginForm();
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed');
    }
}

async function loginUser(event) {
    event.preventDefault();
    console.log('Login function called'); // Debug log 1
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    console.log('Attempting login with username:', username); // Debug log 2

    // Clear any existing storage first
    localStorage.clear();
    console.log('LocalStorage cleared'); // Debug log 3

    // If username is 'admin', try admin login only
    if (username === 'admin') {
        console.log('Admin login attempt detected'); // Debug log 4
        try {
            console.log('Sending admin login request...'); // Debug log 5
            const adminResponse = await fetch('http://localhost:5000/api/admins/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            console.log('Admin response received:', adminResponse.status); // Debug log 6
            const adminData = await adminResponse.json();
            console.log('Admin data:', adminData); // Debug log 7

            if (adminResponse.ok) {
                console.log('Admin login successful'); // Debug log 8
                localStorage.setItem('userId', adminData.adminId);
                localStorage.setItem('username', 'admin');
                localStorage.setItem('isAdmin', 'true');
                console.log('Admin data stored in localStorage'); // Debug log 9
                window.location.href = 'index.html';
            } else {
                console.log('Admin login failed:', adminData.error); // Debug log 10
                alert('Invalid admin credentials');
            }
            return;
        } catch (error) {
            console.error('Admin login error:', error); // Debug log 11
            alert('Login failed');
            return;
        }
    }

    // Regular user login
    console.log('Attempting regular user login'); // Debug log 12
    try {
        const userResponse = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        console.log('User response received:', userResponse.status); // Debug log 13
        const userData = await userResponse.json();
        console.log('User data:', userData); // Debug log 14

        if (userResponse.ok) {
            console.log('User login successful'); // Debug log 15
            localStorage.setItem('userId', userData.userId);
            localStorage.setItem('username', username);
            localStorage.setItem('isAdmin', 'false');
            console.log('User data stored in localStorage'); // Debug log 16
            window.location.href = 'index.html';
        } else {
            console.log('User login failed:', userData.error); // Debug log 17
            alert(userData.error || 'Login failed');
        }
    } catch (error) {
        console.error('User login error:', error); // Debug log 18
        alert('Login failed');
    }
}

// Add this function to check login status
function checkLoginStatus() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const username = localStorage.getItem('username');
    console.log('Login status:', { isAdmin, username }); // Debug log
    return { isAdmin, username };
} 