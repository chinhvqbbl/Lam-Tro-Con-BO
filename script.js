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
    document.body.appendChild(starsContainer);

    const starCount = window.innerWidth < 768 ? 150 : 300;
    const starTypes = ['tiny', 'small', 'medium'];
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        const type = starTypes[Math.floor(Math.random() * starTypes.length)];
        star.className = `star ${type}`;
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starsContainer.appendChild(star);
    }

    // Create meteor shower container
    const meteorShower = document.createElement('div');
    meteorShower.className = 'meteor-shower';
    document.body.appendChild(meteorShower);

    // Start meteor shower
    startMeteorShower(meteorShower);
}

function createMeteorGroup(container, count) {
    const baseAngle = Math.random() * 15 + 30; // 30-45 degrees
    const angleSpread = 10; // Độ phân tán giữa các sao trong nhóm
    
    for (let i = 0; i < count; i++) {
        const meteor = document.createElement('div');
        meteor.className = `meteor ${Math.random() > 0.7 ? 'large' : ''}`;
        
        // Random starting position from top-left quadrant with slight variation
        const startX = Math.random() * (window.innerWidth * 0.5);
        const startY = Math.random() * (window.innerHeight * 0.3);
        
        // Calculate angle for this meteor
        const angle = baseAngle + (Math.random() * angleSpread - angleSpread/2);
        const distance = Math.max(window.innerWidth, window.innerHeight) * 1.5;
        const endX = startX + (distance * Math.cos(angle * Math.PI / 180));
        const endY = startY + (distance * Math.sin(angle * Math.PI / 180));
        
        meteor.style.setProperty('--startX', `${startX}px`);
        meteor.style.setProperty('--startY', `${startY}px`);
        meteor.style.setProperty('--endX', `${endX}px`);
        meteor.style.setProperty('--endY', `${endY}px`);
        meteor.style.setProperty('--angle', `${angle}deg`);
        meteor.style.setProperty('--duration', `${Math.random() * 1 + 0.8}s`); // 0.8-1.8s
        
        container.appendChild(meteor);
        
        meteor.addEventListener('animationend', () => {
            if (container.contains(meteor)) {
                container.removeChild(meteor);
            }
        });
    }
}

function startMeteorShower(container) {
    // Tạo nhóm sao băng ban đầu
    createMeteorGroup(container, 7);

    // Tạo các nhóm sao băng mới
    setInterval(() => {
        const meteorCount = Math.floor(Math.random() * 3) + 5; // 5-7 sao mỗi nhóm
        createMeteorGroup(container, meteorCount);
    }, 2000); // Nhóm mới mỗi 2 giây

    // Thêm các sao băng đơn lẻ
    setInterval(() => {
        if (Math.random() > 0.5) { // 50% cơ hội tạo sao băng đơn
            createMeteorGroup(container, 1);
        }
    }, 500);
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

    const texts = document.querySelectorAll('.text-container');
    texts.forEach(text => {
        text.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) translateZ(0)`;
    });

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
    
    // Tạo kích thước ngẫu nhiên cho text
    const sizes = ['tiny', 'small', 'medium', 'large'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    textElement.setAttribute('class', `falling-text neon-text text-${randomSize}`);
    textElement.textContent = text;
    
    const startX = getRandomNumber(0, window.innerWidth * 0.95);
    const zIndex = Math.floor(getRandomNumber(1, 10)); // Tạo độ sâu ngẫu nhiên
    
    textContainer.appendChild(textElement);
    document.body.appendChild(textContainer);

    textContainer.style.left = `${startX}px`;
    textContainer.style.opacity = '1';
    textContainer.style.zIndex = zIndex;

    // Điều chỉnh độ mờ dựa trên zIndex để tạo cảm giác chiều sâu
    const opacity = 0.4 + (zIndex / 10) * 0.6;
    textElement.style.opacity = opacity;

    let startTime = performance.now();
    const duration = getRandomNumber(10000, 15000);
    const startY = -100;
    const targetY = window.innerHeight + 50;

    function fall() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentY = startY + (targetY - startY) * (progress * progress);
        const currentTransform = textContainer.style.transform || '';
        const rotationTransform = currentTransform.match(/rotate[XY]\([^)]+\)/g) || [];
        const scale = 1 + (zIndex - 1) * 0.1; // Tăng kích thước dựa trên độ sâu
        textContainer.style.transform = `${rotationTransform.join(' ')} translateY(${currentY}px) scale(${scale})`;

        if (currentY >= window.innerHeight) {
            if (document.body.contains(textContainer)) {
                document.body.removeChild(textContainer);
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
    createStars();

    // Thêm event listeners cho touch và mouse
    document.addEventListener('mousedown', handleStart);
    document.addEventListener('touchstart', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    // Bắt đầu animation rotation
    updateRotation();

    const isMobile = window.innerWidth <= 768;
    const textInterval = isMobile ? 100 : 50;

    // Tạo text ngay lập tức
    for (let i = 0; i < 20; i++) {
        createGlowingText();
    }

    // Tiếp tục tạo text mới với interval ngắn hơn
    setInterval(createGlowingText, textInterval);
}

// Khởi động animation ngay khi DOM ready
document.addEventListener('DOMContentLoaded', startAnimation);

// Đơn giản hóa resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
        const elements = document.querySelectorAll('.text-container, .stars-container, .meteor-shower');
        elements.forEach(el => {
            if (document.body.contains(el)) {
                document.body.removeChild(el);
            }
        });
        startAnimation();
    }, 250);
});

// Loại bỏ các event listener không cần thiết và animation update
window.removeEventListener('mousemove', onMouseMove);
window.removeEventListener('touchmove', onTouchMove);
