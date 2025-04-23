document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    // Auto-fill name and email if user is logged in
    const loggedInUsername = localStorage.getItem('username');
    if (loggedInUsername) {
        const nameInput = document.getElementById('name');
        if (nameInput && !nameInput.value) {
            nameInput.value = loggedInUsername;
        }
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate form fields
            if (!name || !email || !subject || !message) {
                showStatus('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showStatus('Please enter a valid email address', 'error');
                return;
            }
            
            // In a real application, we would send this data to a server
            // For demonstration, we'll simulate sending an email to admin
            sendEmailToAdmin(name, email, subject, message);
        });
    }
    
    // Function to send email to admin via API
    async function sendEmailToAdmin(name, email, subject, message) {
        // Show loading message
        formStatus.textContent = 'Sending your message...';
        formStatus.className = 'form-status';
        formStatus.style.display = 'block';
        formStatus.style.backgroundColor = '#e2f3fd';
        formStatus.style.color = '#0c5460';
        formStatus.style.borderColor = '#bee5eb';
        
        try {
            // Send email data to backend
            const response = await fetch('http://localhost:5000/api/email/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Show success message
                showStatus('Your message has been sent to our admin! We will respond to your email shortly.', 'success');
                
                // Reset the form
                contactForm.reset();
            } else {
                // Show error message
                showStatus(data.error || 'Failed to send your message. Please try again later.', 'error');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            showStatus('Failed to connect to our server. Please try again later.', 'error');
        }
    }
    
    // Function to show status message
    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        
        // Scroll to the status message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});