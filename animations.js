document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll-Triggered Reveal Animations
    const animatedElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px"
    });
    animatedElements.forEach((el) => observer.observe(el));

    // 2. 3D Tilt Effect on Cards
    const init3DTilt = () => {
        const cards = document.querySelectorAll('.skill-card, .project-card, .timeline-item, .contact-card, .contact-form, .certification-card, .certificate-preview-container, .certificate-details-container');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                const dx = x - xc;
                const dy = y - yc;
                const rx = -(dy / yc) * 8; // Max 8 degrees vertical tilt
                const ry = (dx / xc) * 8;  // Max 8 degrees horizontal tilt
                
                requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
                });
            });
            
            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                });
            });
        });
    };

    // 3. Staggered Character Reveal for Headings
    const initTextReveal = () => {
        const headings = document.querySelectorAll('.bold-title');
        headings.forEach(heading => {
            if (heading.id === 'hero-title' || heading.children.length > 0) return; // Skip nested headers
            const text = heading.textContent;
            heading.innerHTML = '';
            text.split('').forEach((char, idx) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.transform = 'translateY(30px) scale(0.9)';
                span.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 35}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 35}ms`;
                heading.appendChild(span);
            });

            const textObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const spans = heading.querySelectorAll('span');
                        spans.forEach(span => {
                            span.style.opacity = '1';
                            span.style.transform = 'translateY(0) scale(1)';
                        });
                        textObserver.unobserve(heading);
                    }
                });
            }, { threshold: 0.1 });
            textObserver.observe(heading);
        });
    };

    // 4. Parallax Scroll for Decorative SVGs
    const initParallaxScroll = () => {
        const squiggles = document.querySelectorAll('.squiggly-line-float');
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            requestAnimationFrame(() => {
                squiggles.forEach((sq, idx) => {
                    const speed = (idx % 2 === 0) ? 0.12 : -0.08;
                    sq.style.transform = `translateY(${scrolled * speed}px)`;
                });
            });
        });
    };

    // Initialize all advanced interactive elements
    init3DTilt();
    initTextReveal();
    initParallaxScroll();
});