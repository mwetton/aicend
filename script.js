
console.log("script.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // Keep existing functionality for hamburger menu and header resizing
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    const header = document.querySelector('header');
    const logoContainer = document.querySelector('.logo-container');
    if (header && logoContainer) {
        const initialLogoSize = 120;
        const minLogoSize = 100;
        const scrollDistance = 200;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            let newSize = initialLogoSize - (scrollY / scrollDistance) * (initialLogoSize - minLogoSize);

            if (newSize < minLogoSize) {
                newSize = minLogoSize;
            } else if (newSize > initialLogoSize) {
                newSize = initialLogoSize;
            }

            logoContainer.style.width = `${newSize}px`;
            logoContainer.style.height = `${newSize}px`;
            header.style.height = `${newSize}px`;
            header.style.lineHeight = `${newSize}px`;
        });
    }

    // Contact form specific logic
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        console.log("Contact form found, attaching listener.");
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("Form submission attempted.");

            // Clear previous messages
            clearErrors();
            formMessage.style.display = 'none';

            if (!validateForm()) {
                console.log("Form validation failed.");
                return;
            }

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            console.log("Form data collected, sending JSON:", JSON.stringify(data, null, 2));

            try {
                const response = await fetch('https://contact-relay.matthew-wetton1.workers.dev/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                console.log("Fetch success. Worker response:", result);

                if (response.ok && result.success) {
                    showFormMessage("Your message has been sent!", "success");
                    contactForm.reset();
                } else {
                    showFormMessage(result.message || "An error occurred. Please try again.", "error");
                }
            } catch (error) {
                console.error("Fetch failed:", error);
                showFormMessage("An error occurred. Please try again.", "error");
            }
        });
    } else {
        console.log("Contact form with ID 'contact-form' not found.");
    }

    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        if (name.value.trim() === '') {
            showError(name, "Name is required.");
            isValid = false;
        }

        if (email.value.trim() === '') {
            showError(email, "Email is required.");
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, "Please enter a valid email address.");
            isValid = false;
        }

        if (message.value.trim() === '') {
            showError(message, "Message is required.");
            isValid = false;
        }

        return isValid;
    }

    function showError(inputElement, message) {
        const errorDiv = inputElement.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
        }
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = type; // Use classes for styling success/error
            formMessage.style.display = 'block';
        }
    }

    function isValidEmail(email) {
        // Simplified safe regex for email validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});
