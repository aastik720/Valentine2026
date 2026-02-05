/**
 * ============================================
 * 💕 Valentine's Day Proposal
 * Fully Tested & Working!
 * ============================================
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    maxNoClicks: 5,
    messages: [
        "I think you're really special! 💕",
        "Wait, are you sure about that? 🥺",
        "Please? I got you chocolates! 🍫💝",
        "My heart is cracking... 💔😢",
        "You're really breaking my heart! 😭💔",
        "FINE! But you can only say YES now! 😤💕"
    ],
    meterTexts: [
        "Waiting for your answer...",
        "The No button is getting nervous!",
        "Button starting to run away!",
        "Button is panicking! 😱",
        "LAST CHANCE! 🚨",
        "No escape! Say YES! 💕"
    ],
    statusTexts: [
        "",
        "Try clicking No again... 😏",
        "The button is scared now!",
        "It's trying to escape!",
        "One more and it's gone!",
        "Ha! Now you MUST say YES! 💖"
    ],
    runAwayStart: 2  // Start running after this many clicks
};

// ============================================
// STATE
// ============================================
let state = {
    noClickCount: 0,
    isRunning: false,
    intervalId: null
};

// ============================================
// DOM ELEMENTS
// ============================================
let elements = {};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    console.log('💕 Initializing Valentine Proposal...');
    
    // Cache elements
    elements = {
        bgHearts: document.getElementById('bgHearts'),
        mainContainer: document.getElementById('mainContainer'),
        proposalCard: document.getElementById('proposalCard'),
        character: document.getElementById('character'),
        bearMouth: document.getElementById('bearMouth'),
        message: document.getElementById('message'),
        meterFill: document.getElementById('meterFill'),
        meterText: document.getElementById('meterText'),
        buttonsArea: document.getElementById('buttonsArea'),
        btnYes: document.getElementById('btnYes'),
        btnNo: document.getElementById('btnNo'),
        statusText: document.getElementById('statusText'),
        successOverlay: document.getElementById('successOverlay'),
        successBg: document.getElementById('successBg'),
        successCard: document.getElementById('successCard'),
        btnAgain: document.getElementById('btnAgain')
    };
    
    // Setup event listeners
    setupEvents();
    
    // Start background animation
    startBgHearts();
    
    console.log('✅ Initialization complete!');
}

// ============================================
// EVENT SETUP
// ============================================
function setupEvents() {
    // Yes Button
    elements.btnYes.addEventListener('click', handleYesClick);
    elements.btnYes.addEventListener('touchend', function(e) {
        e.preventDefault();
        handleYesClick();
    });
    
    // No Button
    elements.btnNo.addEventListener('click', handleNoClick);
    elements.btnNo.addEventListener('touchend', function(e) {
        e.preventDefault();
        handleNoClick();
    });
    
    // No Button Hover (desktop) - run away
    elements.btnNo.addEventListener('mouseenter', function() {
        if (state.noClickCount >= CONFIG.runAwayStart && !state.isRunning) {
            moveButtonAway();
        }
    });
    
    // Restart Button
    elements.btnAgain.addEventListener('click', handleRestart);
    elements.btnAgain.addEventListener('touchend', function(e) {
        e.preventDefault();
        handleRestart();
    });
    
    // Keyboard
    document.addEventListener('keydown', handleKeyboard);
}

// ============================================
// YES BUTTON HANDLER
// ============================================
function handleYesClick() {
    console.log('💖 YES clicked!');
    
    // Happy character
    elements.character.classList.remove('sad');
    elements.character.classList.add('happy');
    elements.bearMouth.classList.remove('sad');
    
    // Show success
    showSuccess();
}

// ============================================
// NO BUTTON HANDLER
// ============================================
function handleNoClick() {
    // Don't process if button is hidden
    if (elements.btnNo.classList.contains('hidden')) {
        return;
    }
    
    state.noClickCount++;
    console.log('💔 NO clicked! Count:', state.noClickCount);
    
    // Update UI
    updateMessage();
    updateMeter();
    updateStatus();
    updateCharacter();
    updateButtons();
    
    // Create sad effect
    createSadParticles();
    
    // Move button if past threshold
    if (state.noClickCount >= CONFIG.runAwayStart && state.noClickCount < CONFIG.maxNoClicks) {
        moveButtonAway();
    }
    
    // Hide No button after max clicks
    if (state.noClickCount >= CONFIG.maxNoClicks) {
        hideNoButton();
    }
}

// ============================================
// UPDATE FUNCTIONS
// ============================================
function updateMessage() {
    const index = Math.min(state.noClickCount, CONFIG.messages.length - 1);
    elements.message.textContent = CONFIG.messages[index];
    
    // Shake animation
    elements.message.classList.remove('shake');
    void elements.message.offsetWidth; // Trigger reflow
    elements.message.classList.add('shake');
}

function updateMeter() {
    const progress = (state.noClickCount / CONFIG.maxNoClicks) * 100;
    elements.meterFill.style.width = Math.min(progress, 100) + '%';
    
    const index = Math.min(state.noClickCount, CONFIG.meterTexts.length - 1);
    elements.meterText.textContent = CONFIG.meterTexts[index];
}

function updateStatus() {
    const index = Math.min(state.noClickCount, CONFIG.statusTexts.length - 1);
    elements.statusText.textContent = CONFIG.statusTexts[index];
    
    // Pulse animation
    elements.statusText.classList.remove('pulse');
    void elements.statusText.offsetWidth;
    elements.statusText.classList.add('pulse');
}

function updateCharacter() {
    elements.character.classList.add('sad');
    elements.bearMouth.classList.add('sad');
    
    setTimeout(() => {
        elements.character.classList.remove('sad');
    }, 500);
}

function updateButtons() {
    // Remove old classes
    for (let i = 1; i <= 5; i++) {
        elements.btnNo.classList.remove('shrink-' + i);
        elements.btnYes.classList.remove('grow-' + i);
    }
    
    // Add new classes
    const level = Math.min(state.noClickCount, 4);
    if (level > 0) {
        elements.btnNo.classList.add('shrink-' + level);
        elements.btnYes.classList.add('grow-' + level);
    }
}

// ============================================
// BUTTON MOVEMENT
// ============================================
function moveButtonAway() {
    if (state.isRunning) return;
    state.isRunning = true;
    
    const btn = elements.btnNo;
    const card = elements.proposalCard;
    
    // Add running class
    btn.classList.add('running', 'wiggle');
    
    // Get card boundaries
    const cardRect = card.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    
    // Calculate safe zone (within card area)
    const padding = 20;
    const minX = cardRect.left + padding;
    const maxX = cardRect.right - btnRect.width - padding;
    const minY = cardRect.top + 200; // Below character
    const maxY = cardRect.bottom - btnRect.height - padding;
    
    // Ensure we have valid range
    const rangeX = Math.max(maxX - minX, 50);
    const rangeY = Math.max(maxY - minY, 50);
    
    // Calculate new random position within card
    let newX = minX + Math.random() * rangeX;
    let newY = minY + Math.random() * rangeY;
    
    // Make sure position is within viewport too
    newX = Math.max(20, Math.min(newX, window.innerWidth - btnRect.width - 20));
    newY = Math.max(20, Math.min(newY, window.innerHeight - btnRect.height - 20));
    
    // Avoid Yes button
    const yesRect = elements.btnYes.getBoundingClientRect();
    const safeDistance = 100;
    
    // Check if too close to Yes button
    const distX = Math.abs((newX + btnRect.width/2) - (yesRect.left + yesRect.width/2));
    const distY = Math.abs((newY + btnRect.height/2) - (yesRect.top + yesRect.height/2));
    
    if (distX < safeDistance && distY < safeDistance) {
        // Move to opposite side
        if (newX < yesRect.left) {
            newX = yesRect.left - btnRect.width - 50;
        } else {
            newX = yesRect.right + 50;
        }
        
        // Keep in bounds
        newX = Math.max(20, Math.min(newX, window.innerWidth - btnRect.width - 20));
    }
    
    // Apply position
    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';
    
    // Reset state after animation
    setTimeout(() => {
        btn.classList.remove('wiggle');
        state.isRunning = false;
    }, 300);
}

function hideNoButton() {
    console.log('❌ Hiding No button!');
    
    // Reset position first
    elements.btnNo.classList.remove('running');
    elements.btnNo.style.left = '';
    elements.btnNo.style.top = '';
    
    // Hide with animation
    elements.btnNo.classList.add('hidden');
    
    // Make Yes button super prominent
    elements.btnYes.classList.add('grow-5');
    
    // Celebration burst
    createHeartBurst();
}

// ============================================
// SUCCESS SCREEN
// ============================================
function showSuccess() {
    console.log('🎉 Showing success screen!');
    
    // Show overlay
    elements.successOverlay.classList.add('show');
    
    // Start confetti
    startConfetti();
    
    // Create hearts explosion
    setTimeout(createHeartsExplosion, 500);
}

function startConfetti() {
    const colors = ['#ec407a', '#f48fb1', '#f06292', '#ad1457', '#d81b60', '#ffd700', '#ff6b6b', '#a855f7'];
    const emojis = ['💕', '💖', '💗', '✨', '🎉', '💝', '⭐', '❤️', '🩷'];
    
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random type
        if (Math.random() > 0.5) {
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.fontSize = (15 + Math.random() * 15) + 'px';
            confetti.style.background = 'transparent';
        } else {
            confetti.style.width = (8 + Math.random() * 8) + 'px';
            confetti.style.height = (8 + Math.random() * 8) + 'px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        }
        
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDuration = (3 + Math.random() * 2) + 's';
        
        elements.successBg.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
    
    // Initial burst
    for (let i = 0; i < 40; i++) {
        setTimeout(createConfetti, i * 50);
    }
    
    // Continue confetti
    state.intervalId = setInterval(() => {
        for (let i = 0; i < 10; i++) {
            setTimeout(createConfetti, i * 100);
        }
    }, 2000);
}

function createHeartsExplosion() {
    const hearts = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️', '🧡', '💛', '💚', '💙', '💜', '🩷'];
    
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                left: 50%;
                top: 50%;
                font-size: ${20 + Math.random() * 20}px;
                pointer-events: none;
                z-index: 10000;
                transition: all 1s ease-out;
                transform: translate(-50%, -50%) scale(0);
            `;
            document.body.appendChild(heart);
            
            // Animate outward
            requestAnimationFrame(() => {
                const angle = (i / 40) * Math.PI * 2;
                const distance = 100 + Math.random() * 150;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                heart.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`;
                heart.style.opacity = '0';
            });
            
            setTimeout(() => heart.remove(), 1200);
        }, i * 40);
    }
}

// ============================================
// PARTICLE EFFECTS
// ============================================
function createSadParticles() {
    const particles = ['💔', '😢', '😭', '🥺'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.cssText = `
                position: fixed;
                left: ${50 + (Math.random() - 0.5) * 30}%;
                top: 45%;
                font-size: 25px;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.8s ease-out;
                opacity: 1;
            `;
            document.body.appendChild(particle);
            
            requestAnimationFrame(() => {
                particle.style.transform = 'translateY(-80px) scale(0.5)';
                particle.style.opacity = '0';
            });
            
            setTimeout(() => particle.remove(), 1000);
        }, i * 80);
    }
}

function createHeartBurst() {
    const hearts = ['💕', '💖', '💗', '✨', '💝'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                left: 50%;
                top: 50%;
                font-size: ${18 + Math.random() * 15}px;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.8s ease-out;
                transform: translate(-50%, -50%) scale(0);
            `;
            document.body.appendChild(heart);
            
            requestAnimationFrame(() => {
                const angle = (i / 15) * Math.PI * 2;
                const distance = 80 + Math.random() * 60;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                heart.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`;
                heart.style.opacity = '0';
            });
            
            setTimeout(() => heart.remove(), 1000);
        }, i * 30);
    }
}

// ============================================
// BACKGROUND HEARTS
// ============================================
function startBgHearts() {
    const hearts = ['💕', '💖', '💗', '💓', '💝', '❤️', '🩷'];
    
    function createBgHeart() {
        const heart = document.createElement('div');
        heart.className = 'bg-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (16 + Math.random() * 16) + 'px';
        heart.style.animationDuration = (8 + Math.random() * 4) + 's';
        heart.style.animationDelay = Math.random() + 's';
        
        elements.bgHearts.appendChild(heart);
        
        setTimeout(() => heart.remove(), 15000);
    }
    
    // Initial hearts
    for (let i = 0; i < 10; i++) {
        setTimeout(createBgHeart, i * 300);
    }
    
    // Continue creating
    setInterval(createBgHeart, 800);
}

// ============================================
// RESTART
// ============================================
function handleRestart() {
    console.log('🔄 Restarting...');
    
    // Clear interval
    if (state.intervalId) {
        clearInterval(state.intervalId);
    }
    
    // Reset state
    state.noClickCount = 0;
    state.isRunning = false;
    
    // Hide success
    elements.successOverlay.classList.remove('show');
    
    // Clear confetti
    elements.successBg.innerHTML = '';
    
    // Reset character
    elements.character.classList.remove('sad', 'happy');
    elements.bearMouth.classList.remove('sad');
    
    // Reset message
    elements.message.textContent = CONFIG.messages[0];
    elements.message.classList.remove('shake');
    
    // Reset meter
    elements.meterFill.style.width = '0%';
    elements.meterText.textContent = CONFIG.meterTexts[0];
    
    // Reset status
    elements.statusText.textContent = '';
    
    // Reset No button
    elements.btnNo.classList.remove('hidden', 'running', 'wiggle');
    elements.btnNo.style.left = '';
    elements.btnNo.style.top = '';
    for (let i = 1; i <= 5; i++) {
        elements.btnNo.classList.remove('shrink-' + i);
    }
    
    // Reset Yes button
    for (let i = 1; i <= 5; i++) {
        elements.btnYes.classList.remove('grow-' + i);
    }
}

// ============================================
// KEYBOARD SUPPORT
// ============================================
function handleKeyboard(e) {
    const isSuccess = elements.successOverlay.classList.contains('show');
    
    if (!isSuccess) {
        if (e.key === 'y' || e.key === 'Y' || e.key === 'Enter') {
            handleYesClick();
        } else if (e.key === 'n' || e.key === 'N') {
            handleNoClick();
        }
    } else {
        if (e.key === 'r' || e.key === 'R' || e.key === 'Escape') {
            handleRestart();
        }
    }
}

// ============================================
// TOUCH HANDLING
// ============================================
document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// ============================================
// START APP
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
