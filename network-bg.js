const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Get mouse position
let mouse = {
    x: null,
    y: null,
    radius: 120
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Create Particle class for highly visible gold sparkles and star-like twinkles
class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseSize = size;
        this.alpha = Math.random() * 0.7 + 0.3; // Starts between 0.3 and 1.0 opacity
        this.twinkleSpeed = (Math.random() * 0.012) + 0.006;
        this.directionX = (Math.random() * 0.25) - 0.125;
        this.directionY = (Math.random() * 0.25) - 0.125;
    }

    // Draw individual sparkle or twinkle star
    draw() {
        ctx.save();
        
        // Animate alpha for twinkling (keep it highly visible)
        this.alpha += this.twinkleSpeed;
        if (this.alpha > 1.0 || this.alpha < 0.3) {
            this.twinkleSpeed = -this.twinkleSpeed;
        }
        this.alpha = Math.max(0.3, Math.min(1.0, this.alpha));

        // Use bright lavender style color for sparkles: rgba(199, 125, 255, ...)
        ctx.fillStyle = `rgba(199, 125, 255, ${this.alpha})`;
        ctx.shadowBlur = this.size * 3.5;
        ctx.shadowColor = 'rgba(199, 125, 255, 0.9)';

        if (this.baseSize > 1.5) {
            // Draw a small 4-point star for larger twinkles
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size * 2.5);
            ctx.quadraticCurveTo(this.x, this.y, this.x + this.size * 2.5, this.y);
            ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + this.size * 2.5);
            ctx.quadraticCurveTo(this.x, this.y, this.x - this.size * 2.5, this.y);
            ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - this.size * 2.5);
            ctx.closePath();
            ctx.fill();
        } else {
            // Draw a tiny sparkling circle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fill();
        }
        ctx.restore();
    }

    // Update position
    update() {
        this.x += this.directionX;
        this.y += this.directionY;

        // Wrap around borders
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.draw();
    }
}

// Initialize particles (larger size range for visibility)
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    
    if (numberOfParticles > 120) numberOfParticles = 120;
    if (numberOfParticles < 50) numberOfParticles = 50;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.8) + 0.8;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y, size));
    }
}

// Animation loop
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 110) {
                opacityValue = 1 - (distance / 110);
                ctx.strokeStyle = `rgba(199, 125, 255, ${opacityValue * 0.15})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
        
        // Connect to mouse
        if (mouse.x !== undefined && mouse.y !== undefined) {
            let dx = particlesArray[a].x - mouse.x;
            let dy = particlesArray[a].y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                opacityValue = 1 - (distance / mouse.radius);
                ctx.strokeStyle = `rgba(224, 170, 255, ${opacityValue * 0.25})`;
                ctx.lineWidth = 1.0;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Handle window resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Setup
function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
    animate();
}

if (document.readyState === 'complete') {
    setup();
} else {
    window.addEventListener('load', setup);
}