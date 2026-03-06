document.addEventListener('DOMContentLoaded', () => {
    // Theme Switcher
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeBtn.textContent = '☀️ Light Mode';
    }
    
    // Theme toggle handler
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        themeBtn.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', async (e) => {
        // 1. Prevent the page from refreshing
        e.preventDefault();

        // 2. Collect data from the form fields
        const formData = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value,
            message: document.getElementById('message').value
        };

        try {
            // 3. Send the data to your Java backend (localhost:8080)
            const response = await fetch('http://localhost:8080/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // 4. Handle the response from Java
            if (response.ok) {
                const result = await response.text();
                alert("Success: " + result);
                contactForm.reset(); // Clear the form
            } else {
                alert("Server Error: " + response.statusText);
            }
        } catch (error) {
            // 5. Handle network errors (e.g., if Java app isn't running)
            console.error("Error connecting to backend:", error);
            alert("Could not connect to the Java server. Is it running on port 8080?");
        }
    });
});