// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip download buttons (handled separately) and empty anchors
        if (href === '#' || this.classList.contains('download-btn')) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            // If target doesn't exist (like #privacy, #faq, etc.), show message
            console.log(`Section ${href} is not available yet`);
        }
    });
});

// Add scroll animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature items and steps
document.querySelectorAll('.feature-item, .step, .screenshot-item').forEach(item => {
    // Only set initial styles if not already animated by CSS
    if (!item.style.opacity) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
    observer.observe(item);
});

// Simple form handling for waitlist (if you add one)
// You can integrate with a service like Mailchimp, ConvertKit, or Firebase
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Khafī is coming soon! Check back later or contact us to join the waitlist.');
    });
});

// Add subtle parallax effect to hero (only if not conflicting with CSS animations)
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight && scrolled !== lastScrollTop) {
        // Only apply parallax to background, not the entire hero container
        const patternOverlay = hero.querySelector('.pattern-overlay');
        if (patternOverlay) {
            patternOverlay.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        lastScrollTop = scrolled;
    }
});
