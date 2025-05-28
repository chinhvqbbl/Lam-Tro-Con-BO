const loveTexts = [
    'i love u',
    'Thank you for coming',
    'Our Anniversary',
    'Cún ❤️ Bin',
    'harumi11.gift4u',
    'Forever',
    'Together',
    'Love You',
    'Miss You',
    'Always'
];

const heartTypes = ['heart-simple', 'heart-sparkle', 'heart-pulse', 'heart-glow', 'heart-ribbon', 'heart-custom'];

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Thêm biến để theo dõi touch/mouse
let isDragging = false;
let startX = 0;
let startY = 0;
let rotationX = 0;
let rotationY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
const ROTATION_SPEED = 0.5;
const DAMPING = 0.95;
const INERTIA_THRESHOLD = 0.01;

// Tối ưu animation update
let lastUpdateTime = 0;
const UPDATE_INTERVAL = 1000 / 30; // 30fps cho hiệu ứng 3D

function getRandomText() {
    return loveTexts[Math.floor(Math.random() * loveTexts.length)];
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// Kiểm tra thiết bị
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Tạo các ngôi sao nền
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    const universeContainer = document.querySelector('.universe-container');
    universeContainer.appendChild(starsContainer);

    const starCount = window.innerWidth < 768 ? 150 : 300;
    const starTypes = ['tiny', 'small', 'medium'];
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        const type = starTypes[Math.floor(Math.random() * starTypes.length)];
        star.className = `star ${type}`;
        
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        const z = Math.random() * 200 - 100;
        
        star.style.transform = `translate3d(${x}%, ${y}%, ${z}px)`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starsContainer.appendChild(star);
    }

    // Create meteor shower container
    const meteorShower = document.createElement('div');
    meteorShower.className = 'meteor-shower';
    universeContainer.appendChild(meteorShower);

    // Start meteor shower
    startMeteorShower(meteorShower);
}

function createMeteor(container) {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    
    // Random starting position from top-left quadrant
    const startX = Math.random() * (window.innerWidth * 0.5);
    const startY = Math.random() * (window.innerHeight * 0.3);
    
    // Calculate end position for diagonal movement
    const angle = Math.random() * 15 + 30; // 30-45 degrees
    const distance = Math.max(window.innerWidth, window.innerHeight) * 1.5;
    const endX = startX + (distance * Math.cos(angle * Math.PI / 180));
    const endY = startY + (distance * Math.sin(angle * Math.PI / 180));
    
    // Set CSS variables for animation
    meteor.style.setProperty('--startX', `${startX}px`);
    meteor.style.setProperty('--startY', `${startY}px`);
    meteor.style.setProperty('--endX', `${endX}px`);
    meteor.style.setProperty('--endY', `${endY}px`);
    meteor.style.setProperty('--angle', `${angle}deg`);
    meteor.style.setProperty('--duration', `${Math.random() * 1 + 0.5}s`); // 0.5-1.5s
    
    container.appendChild(meteor);
    
    // Remove meteor after animation
    meteor.addEventListener('animationend', () => {
        if (container.contains(meteor)) {
            container.removeChild(meteor);
        }
    });
}

function startMeteorShower(container) {
    // Create initial batch of meteors
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createMeteor(container), i * 100);
    }

    // Continuously create new meteors
    setInterval(() => {
        const meteorCount = Math.floor(Math.random() * 3) + 1; // 1-3 meteors at a time
        for (let i = 0; i < meteorCount; i++) {
            setTimeout(() => createMeteor(container), i * 100);
        }
    }, 2000); // New batch every 2 seconds
}

// Tạo hiệu ứng sao nền
function createStarryBackground() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.appendChild(starsContainer);

    // Tạo các ngôi sao nền
    const starCount = isMobileDevice() ? 100 : 200;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star-background';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--twinkle-duration', `${getRandomNumber(2, 6)}s`);
        starsContainer.appendChild(star);
    }

    // Tạo sao băng
    setInterval(() => createShootingStar(starsContainer), 2000);
}

// Tạo sao băng
function createShootingStar(container) {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    const startX = Math.random() * window.innerWidth;
    const angle = getRandomNumber(15, 45);
    const distance = getRandomNumber(100, 200);
    
    star.style.left = `${startX}px`;
    star.style.top = '0';
    star.style.setProperty('--angle', `${angle}deg`);
    star.style.setProperty('--distance', `${distance}px`);
    star.style.setProperty('--shooting-duration', `${getRandomNumber(0.8, 1.5)}s`);
    
    container.appendChild(star);
    setTimeout(() => star.remove(), 2000);
}

// Tạo hiệu ứng nebula
function createNebula() {
    const nebula = document.createElement('div');
    nebula.className = 'nebula';
    document.body.appendChild(nebula);
}

// Theo dõi vị trí chuột
function onMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

// Xử lý touch move cho mobile
function onTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

// Cập nhật animation
function updateAnimation(currentTime) {
    if (currentTime - lastUpdateTime < UPDATE_INTERVAL) {
        requestAnimationFrame(updateAnimation);
        return;
    }
    lastUpdateTime = currentTime;

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    const containers = document.querySelectorAll('.text-container');
    containers.forEach(container => {
        const zDistance = parseFloat(container.dataset.zDistance || 0);
        const baseScale = parseFloat(container.dataset.baseScale || 1);
        const translateY = parseFloat(container.dataset.translateY || 0);
        
        const rotationY = (targetX / windowHalfX) * 10 * (zDistance / 400);
        const rotationX = -(targetY / windowHalfY) * 10 * (zDistance / 400);
        const zoomScale = baseScale * (1 + Math.abs(targetX) / windowHalfX * 0.1);

        container.style.transform = `
            translateY(${translateY}px)
            translateZ(${-zDistance}px)
            rotateY(${rotationY}deg)
            rotateX(${rotationX}deg)
            scale(${zoomScale})
        `;
    });

    requestAnimationFrame(updateAnimation);
}

// Xử lý touch/mouse events
function handleStart(e) {
    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
}

function handleMove(e) {
    if (!isDragging) return;

    e.preventDefault();
    const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    targetRotationY += deltaX * ROTATION_SPEED;
    targetRotationX -= deltaY * ROTATION_SPEED;

    startX = currentX;
    startY = currentY;
}

function handleEnd() {
    isDragging = false;
}

// Animation cho rotation
function updateRotation() {
    if (!isDragging) {
        targetRotationX *= DAMPING;
        targetRotationY *= DAMPING;

        if (Math.abs(targetRotationX) < INERTIA_THRESHOLD) targetRotationX = 0;
        if (Math.abs(targetRotationY) < INERTIA_THRESHOLD) targetRotationY = 0;
    }

    rotationX += (targetRotationX - rotationX) * 0.1;
    rotationY += (targetRotationY - rotationY) * 0.1;

    const container = document.querySelector('.universe-container');
    if (container) {
        container.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }

    requestAnimationFrame(updateRotation);
}

function createUniverseContainer() {
    const container = document.createElement('div');
    container.className = 'universe-container';
    document.body.appendChild(container);
    return container;
}

function createGlowingText() {
    const maxTexts = 200;
    const currentTexts = document.querySelectorAll('.text-container').length;
    if (currentTexts >= maxTexts) return;

    const textContainer = document.createElement('div');
    textContainer.setAttribute('class', 'text-container');
    
    const text = getRandomText();
    const textElement = document.createElement('div');
    textElement.setAttribute('class', 'falling-text neon-text');
    textElement.textContent = text;
    
    const startX = getRandomNumber(-window.innerWidth * 0.5, window.innerWidth * 0.5);
    const startZ = getRandomNumber(-500, 500);
    
    textContainer.appendChild(textElement);
    const universeContainer = document.querySelector('.universe-container');
    universeContainer.appendChild(textContainer);

    textContainer.dataset.translateY = -100;
    textContainer.style.transform = `translate3d(${startX}px, 0, ${startZ}px)`;
    textContainer.style.opacity = '1';

    let startTime = performance.now();
    const duration = getRandomNumber(10000, 15000);
    const startY = -100;
    const targetY = window.innerHeight + 50;

    function fall() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentY = startY + (targetY - startY) * (progress * progress);
        const currentTransform = textContainer.style.transform;
        textContainer.style.transform = `${currentTransform.split('translateY')[0]} translateY(${currentY}px)`;

        if (currentY >= window.innerHeight) {
            if (universeContainer.contains(textContainer)) {
                universeContainer.removeChild(textContainer);
            }
            return;
        }

        requestAnimationFrame(fall);
    }

    requestAnimationFrame(fall);
}

function createHeart() {
    const heart = document.createElement('div');
    const heartType = heartTypes[Math.floor(Math.random() * heartTypes.length)];
    heart.setAttribute('class', `heart ${heartType}`);
    document.body.appendChild(heart);

    const startX = getRandomNumber(0, window.innerWidth * 0.9);
    const scale = getRandomNumber(0.5, 1.2);
    const duration = getRandomNumber(4, 7);
    const zIndex = Math.floor(getRandomNumber(1, 100));
    const diagonalDirection = getRandomNumber(-50, 50);
    const rotation = getRandomNumber(-30, 30);

    heart.style.left = `${startX}px`;
    heart.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    heart.style.setProperty('--diagonal-move', `${diagonalDirection}px`);
    heart.style.animationDuration = `${duration}s`;
    heart.style.zIndex = zIndex;

    const timeout = setTimeout(() => {
        if (document.body.contains(heart)) {
            document.body.removeChild(heart);
        }
        clearTimeout(timeout);
    }, duration * 1000);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function startAnimation() {
    const universeContainer = createUniverseContainer();
    createStars();

    // Thêm event listeners cho touch và mouse
    universeContainer.addEventListener('mousedown', handleStart);
    universeContainer.addEventListener('touchstart', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    // Bắt đầu animation rotation
    updateRotation();

    const isMobile = isMobileDevice();
    const textInterval = isMobile ? 100 : 50;

    // Tạo nhiều text ban đầu
    for (let i = 0; i < 50; i++) {
        setTimeout(() => createGlowingText(), i * 50);
    }

    // Tiếp tục tạo text mới
    setInterval(createGlowingText, textInterval);
    setInterval(createHeart, isMobile ? 5000 : 4000);
}

// Khởi động animation
window.addEventListener('load', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    startAnimation();
});

// Đơn giản hóa resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
        const universeContainer = document.querySelector('.universe-container');
        if (universeContainer) {
            document.body.removeChild(universeContainer);
        }
        startAnimation();
    }, 250);
});

// Loại bỏ các event listener không cần thiết và animation update
window.removeEventListener('mousemove', onMouseMove);
window.removeEventListener('touchmove', onTouchMove);
