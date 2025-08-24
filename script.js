const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ''
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

navSlide();

// Some more animation for the nav-active class to work
const style = document.createElement('style');
style.innerHTML = `
.nav-active {
    transform: translateX(0%) !important;
}

@keyframes navLinkFade {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0px);
    }
}

.toggle .line1 {
    transform: rotate(-45deg) translate(-5px, 6px);
}

.toggle .line2 {
    opacity: 0;
}

.toggle .line3 {
    transform: rotate(45deg) translate(-5px, -6px);
}
`;

document.head.appendChild(style);

// Make nav links work on mobile
const navLinks = document.querySelectorAll('.nav-links li a');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.querySelector('.nav-links');
        const burger = document.querySelector('.burger');
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ''
            }
        });
    });
});

// Shrink logo on scroll with requestAnimationFrame for performance
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const header = document.querySelector('header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      ticking = false;
    });

    ticking = true;
  }
});

// Contact form validation and submission
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form fields
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    let isValid = true;

    // Validate name
    if (name.value.trim() === '') {
        isValid = false;
        name.nextElementSibling.textContent = 'Name is required.';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        isValid = false;
        email.nextElementSibling.textContent = 'Please enter a valid email address.';
    }

    

    // Validate message
    if (message.value.trim() === '') {
        isValid = false;
        message.nextElementSibling.textContent = 'Message is required.';
    }

    if (isValid) {
        // Send form data to Cloudflare Worker
        const workerUrl = 'https://contact-relay.matthew-wetton1.workers.dev/';

        fetch(workerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                message: message.value
            })
        })
        .then(response => response.json())
        .then(data => {
            const formMessage = document.getElementById('form-message');
            if (data.success) {
                formMessage.textContent = 'Thank you for your message!';
                formMessage.className = 'success';
                formMessage.style.display = 'block';
                contactForm.reset();
            } else {
                formMessage.textContent = 'An error occurred. Please try again.';
                formMessage.className = 'error';
                formMessage.style.display = 'block';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            const formMessage = document.getElementById('form-message');
            formMessage.textContent = 'An error occurred. Please try again.';
            formMessage.className = 'error';
            formMessage.style.display = 'block';
        });
    }
});
