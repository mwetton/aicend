// script.js

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const mainHeader = document.querySelector('header'); // Get the header element

    // Comment: Handles the mobile navigation toggle.
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close the nav menu when a link is clicked (for single-page navigation)
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

    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // prevents page reload

            if (!validateForm()) return; // stop if invalid

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Sending data:', data); // debug

            try {
                const response = await fetch('https://contact-relay.matthew-wetton1.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                console.log('Worker response:', result);

                if (result.success) {
                    formMessage.textContent = 'Your message has been sent!';
                    formMessage.style.display = 'block';
                    formMessage.classList.remove('error');
                    formMessage.classList.add('success');
                    contactForm.reset();
                } else {
                    formMessage.textContent = 'An error occurred. Please try again.';
                    formMessage.style.display = 'block';
                    formMessage.classList.remove('success');
                    formMessage.classList.add('error');
                }

            } catch (err) {
                console.error('Fetch error:', err);
                formMessage.textContent = 'An error occurred. Please try again.';
                formMessage.style.display = 'block';
                formMessage.classList.remove('success');
                formMessage.classList.add('error');
            }
        });
    }

    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        if (name.value.trim() === '') {
            showError(name, 'Name is required.');
            isValid = false;
        }

        if (email.value.trim() === '') {
            showError(email, 'Email is required.');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address.');
            isValid = false;
        }

        if (message.value.trim() === '') {
            showError(message, 'Message is required.');
            isValid = false;
        }

        return isValid;
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = message;
    }

    function isValidEmail(email) {
        const re = /^(([^<>()[\\]\\.,;:\s@\"]+(\.[^<>()[\\]\\.,;:\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\\.[0-9]{1,3}\\\.[0-9]{1,3}\\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});