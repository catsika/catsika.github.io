// Portfolio Website - Main JavaScript

// ===========================
// Navigation Functionality
// ===========================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('#header');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Header scroll effect
let lastScroll = 0;
const readingProgress = document.getElementById('readingProgress');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update reading progress bar
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (currentScroll / windowHeight) * 100;
    if (readingProgress) {
        readingProgress.style.width = progress + '%';
    }
    
    lastScroll = currentScroll;
});

// ===========================
// Smooth Scrolling
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Intersection Observer for Animations
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.project-card, .skill-card, .contact-card');
animateElements.forEach(el => observer.observe(el));

// ===========================
// Form Handling
// ===========================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success message
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // In a real application, you would send the data to a backend:
            // try {
            //     const response = await fetch('YOUR_API_ENDPOINT', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify(data)
            //     });
            //     
            //     if (response.ok) {
            //         alert('Message sent successfully!');
            //         contactForm.reset();
            //     } else {
            //         throw new Error('Failed to send message');
            //     }
            // } catch (error) {
            //     alert('There was an error sending your message. Please try again.');
            // } finally {
            //     submitBtn.textContent = originalText;
            //     submitBtn.disabled = false;
            // }
        }, 1500);
    });
}

// ===========================
// Active Navigation Link
// ===========================

const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===========================
// Typing Effect (Optional Enhancement)
// ===========================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect on hero subtitle
// window.addEventListener('load', () => {
//     const subtitle = document.querySelector('.hero-subtitle');
//     const originalText = subtitle.textContent;
//     typeWriter(subtitle, originalText, 100);
// });

// ===========================
// Dark Mode Toggle (Optional)
// ===========================

// Uncomment to add dark mode functionality
// const darkModeToggle = document.createElement('button');
// darkModeToggle.classList.add('dark-mode-toggle');
// darkModeToggle.innerHTML = '🌙';
// darkModeToggle.setAttribute('aria-label', 'Toggle Dark Mode');
// document.body.appendChild(darkModeToggle);

// const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
// const currentTheme = localStorage.getItem('theme');

// if (currentTheme === 'dark') {
//     document.body.classList.add('dark-mode');
// } else if (currentTheme === 'light') {
//     document.body.classList.add('light-mode');
// }

// darkModeToggle.addEventListener('click', () => {
//     if (document.body.classList.contains('dark-mode')) {
//         document.body.classList.remove('dark-mode');
//         localStorage.setItem('theme', 'light');
//         darkModeToggle.innerHTML = '🌙';
//     } else {
//         document.body.classList.add('dark-mode');
//         localStorage.setItem('theme', 'dark');
//         darkModeToggle.innerHTML = '☀️';
//     }
// });

// ===========================
// Initialize
// ===========================

console.log('Portfolio website loaded successfully! 🚀');
