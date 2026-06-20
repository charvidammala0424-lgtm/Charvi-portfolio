document.addEventListener('DOMContentLoaded', () => {
    // Select all elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.fade-up');

    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add the 'visible' class when the element comes into view
                entry.target.classList.add('visible');
                // Optional: Stop observing once it's visible so it doesn't animate out and in repeatedly
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before the bottom of the screen
    });

    // Start observing each element
    animatedElements.forEach((el) => observer.observe(el));
});