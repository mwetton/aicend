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
});