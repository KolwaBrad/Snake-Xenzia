// snake-game/static/js/game.js

// --- DOM Elements ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

// --- Game Constants ---
const GRID_SIZE = 20;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
// Snake Colors (keep bright green, maybe slightly different shade)
const SNAKE_COLOR = '#33ff33'; // Slightly different green
const SNAKE_HEAD_COLOR = '#00cc00'; // Darker green head
const FOOD_COLOR = '#ff4136'; // Red food
const EYE_COLOR = 'white';
const PUPIL_COLOR = 'black';

// --- Sound Effects ---
// Create Audio objects - use absolute paths from web root
try {
    const eatSound = new Audio('/static/sounds/eat.mp3');
    const gameOverSound = new Audio('/static/sounds/gameover.mp3');
    const backgroundMusic = new Audio('/static/sounds/background.mp3');

    // Configure background music
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.25; // Lower volume for background

    // Adjust effect volumes if needed
    eatSound.volume = 0.6;
    gameOverSound.volume = 0.8;

    // --- Global sound variables --- (to access them in functions)
    window.eatSound = eatSound;
    window.gameOverSound = gameOverSound;
    window.backgroundMusic = backgroundMusic;

} catch (error) {
    console.error("Error initializing audio:", error);
    // Provide dummy objects if Audio fails (e.g., in environments without Audio support)
    window.eatSound = { play: () => {}, currentTime: 0 };
    window.gameOverSound = { play: () => {}, currentTime: 0 };
    window.backgroundMusic = { play: () => {}, pause: () => {}, currentTime: 0 };
}


// --- Game State Variables ---
let snake = [];
let dx = GRID_SIZE;
let dy = 0;
let food = { x: 0, y: 0 };
let score = 0;
let changingDirection = false;
let gameLoopTimeout;
let isGameOver = false;
let gameStarted = false;
const INITIAL_SPEED = 150;
let gameSpeed = INITIAL_SPEED;

// --- Game Functions ---

function clearCanvas() {
    ctx.fillStyle = '#111'; // Match CSS background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * Draws a single segment of the snake with eyes for the head.
 * @param {object} segment - The snake segment {x, y}.
 * @param {boolean} isHead - If true, draw with the head color and eyes.
 */
function drawSnakePart(segment, isHead = false) {
    ctx.fillStyle = isHead ? SNAKE_HEAD_COLOR : SNAKE_COLOR;
    ctx.strokeStyle = '#050505'; // Very dark outline
    ctx.lineWidth = 1;

    // Draw the main segment rectangle
    ctx.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
    ctx.strokeRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);

    // Add eyes to the head segment
    if (isHead) {
        ctx.fillStyle = EYE_COLOR;
        const eyeSize = GRID_SIZE / 5;
        const pupilSize = eyeSize / 2;
        let eye1X, eye1Y, eye2X, eye2Y, pupil1X, pupil1Y, pupil2X, pupil2Y;

        // Determine eye position based on direction of travel
        if (dx > 0) { // Moving Right
            eye1X = segment.x + GRID_SIZE * 0.6; eye1Y = segment.y + GRID_SIZE * 0.2;
            eye2X = segment.x + GRID_SIZE * 0.6; eye2Y = segment.y + GRID_SIZE * 0.8 - eyeSize;
        } else if (dx < 0) { // Moving Left
            eye1X = segment.x + GRID_SIZE * 0.4 - eyeSize; eye1Y = segment.y + GRID_SIZE * 0.2;
            eye2X = segment.x + GRID_SIZE * 0.4 - eyeSize; eye2Y = segment.y + GRID_SIZE * 0.8 - eyeSize;
        } else if (dy > 0) { // Moving Down
            eye1X = segment.x + GRID_SIZE * 0.2; eye1Y = segment.y + GRID_SIZE * 0.6;
            eye2X = segment.x + GRID_SIZE * 0.8 - eyeSize; eye2Y = segment.y + GRID_SIZE * 0.6;
        } else { // Moving Up (dy < 0 or initial state)
            eye1X = segment.x + GRID_SIZE * 0.2; eye1Y = segment.y + GRID_SIZE * 0.4 - eyeSize;
            eye2X = segment.x + GRID_SIZE * 0.8 - eyeSize; eye2Y = segment.y + GRID_SIZE * 0.4 - eyeSize;
        }

        // Draw eyes (white part)
        ctx.fillRect(eye1X, eye1Y, eyeSize, eyeSize);
        ctx.fillRect(eye2X, eye2Y, eyeSize, eyeSize);

        // Draw pupils (black part) - slightly offset within the eye
        ctx.fillStyle = PUPIL_COLOR;
        pupil1X = eye1X + eyeSize / 2 - pupilSize / 2;
        pupil1Y = eye1Y + eyeSize / 2 - pupilSize / 2;
        pupil2X = eye2X + eyeSize / 2 - pupilSize / 2;
        pupil2Y = eye2Y + eyeSize / 2 - pupilSize / 2;
        ctx.fillRect(pupil1X, pupil1Y, pupilSize, pupilSize);
        ctx.fillRect(pupil2X, pupil2Y, pupilSize, pupilSize);
    }
}


function drawSnake() {
    snake.forEach((segment, index) => {
        drawSnakePart(segment, index === 0); // First segment is the head
    });
}

function drawFood() {
    ctx.fillStyle = FOOD_COLOR;
    ctx.strokeStyle = '#b32d25'; // Darker outline for food
    ctx.lineWidth = 1;
    // Slightly rounded food
    ctx.beginPath();
    // ctx.roundRect(food.x + 2, food.y + 2, GRID_SIZE - 4, GRID_SIZE - 4, [3]); // Use if supported
    // Fallback: draw rect slightly smaller
     ctx.fillRect(food.x + 2, food.y + 2, GRID_SIZE - 4, GRID_SIZE - 4);
    ctx.strokeRect(food.x + 2, food.y + 2, GRID_SIZE - 4, GRID_SIZE - 4);

     // Optional: Add a simple shine effect
     ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
     ctx.beginPath();
     ctx.arc(food.x + GRID_SIZE * 0.3, food.y + GRID_SIZE * 0.3, GRID_SIZE * 0.15, 0, Math.PI * 2);
     ctx.fill();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;

    if (didEatFood) {
        score += 10;
        scoreElement.textContent = score;
        // Play eat sound
        window.eatSound.currentTime = 0; // Rewind first
        window.eatSound.play().catch(e => console.warn("Eat sound play failed:", e)); // Play sound
        placeFood();
        // Optionally increase speed
        // gameSpeed = Math.max(50, gameSpeed * 0.97);
    } else {
        snake.pop();
    }
}

function randomGridCoord(max) {
    return Math.floor(Math.random() * (max / GRID_SIZE)) * GRID_SIZE;
}

function placeFood() {
    let newFoodX, newFoodY;
    while (true) {
        newFoodX = randomGridCoord(CANVAS_WIDTH);
        newFoodY = randomGridCoord(CANVAS_HEIGHT);
        let collision = false;
        // Check collision with snake AND current food position (just in case)
        if (food.x === newFoodX && food.y === newFoodY) {
             collision = true;
        }
        if (!collision) {
            for (const segment of snake) {
                if (segment.x === newFoodX && segment.y === newFoodY) {
                    collision = true;
                    break;
                }
            }
        }
        if (!collision) {
            break;
        }
    }
    food = { x: newFoodX, y: newFoodY };
}


function changeDirection(event) {
    if (changingDirection || !gameStarted || isGameOver) return;

    changingDirection = true;

    const key = event.key;
    const goingUp = dy === -GRID_SIZE;
    const goingDown = dy === GRID_SIZE;
    const goingLeft = dx === -GRID_SIZE;
    const goingRight = dx === GRID_SIZE;

    let changed = false;
    if ((key === 'ArrowLeft' || key.toLowerCase() === 'a') && !goingRight) {
        dx = -GRID_SIZE; dy = 0; changed = true;
    } else if ((key === 'ArrowUp' || key.toLowerCase() === 'w') && !goingDown) {
        dx = 0; dy = -GRID_SIZE; changed = true;
    } else if ((key === 'ArrowRight' || key.toLowerCase() === 'd') && !goingLeft) {
        dx = GRID_SIZE; dy = 0; changed = true;
    } else if ((key === 'ArrowDown' || key.toLowerCase() === 's') && !goingUp) {
        dx = 0; dy = GRID_SIZE; changed = true;
    }

    // If direction didn't actually change, allow another input immediately
    if (!changed) {
        changingDirection = false;
    }
}

function checkGameOver() {
    const head = snake[0];
    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= CANVAS_WIDTH;
    const hitTopWall = head.y < 0;
    const hitBottomWall = head.y >= CANVAS_HEIGHT;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) { // Check collision with body (index > 0)
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function initializeGame() {
    snake = [
        { x: Math.floor(CANVAS_WIDTH / 2 / GRID_SIZE) * GRID_SIZE, y: Math.floor(CANVAS_HEIGHT / 2 / GRID_SIZE) * GRID_SIZE },
        { x: Math.floor(CANVAS_WIDTH / 2 / GRID_SIZE - 1) * GRID_SIZE, y: Math.floor(CANVAS_HEIGHT / 2 / GRID_SIZE) * GRID_SIZE },
        { x: Math.floor(CANVAS_WIDTH / 2 / GRID_SIZE - 2) * GRID_SIZE, y: Math.floor(CANVAS_HEIGHT / 2 / GRID_SIZE) * GRID_SIZE },
    ];
    dx = GRID_SIZE;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    changingDirection = false;
    isGameOver = false;
    gameSpeed = INITIAL_SPEED;

    placeFood();

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');

    gameStarted = true;

    // Start background music
    window.backgroundMusic.currentTime = 0; // Rewind
    // Use a promise to handle potential autoplay restrictions
    const playPromise = window.backgroundMusic.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn("Background music autoplay prevented:", error);
            // Optionally, show a message or button to enable sound manually
        });
    }

    mainGameLoop(); // Start the game loop
}

function showGameOver() {
    isGameOver = true;
    gameStarted = false;
    clearTimeout(gameLoopTimeout); // Stop game loop

    // Stop background music and play game over sound
    window.backgroundMusic.pause();
    window.gameOverSound.currentTime = 0;
    window.gameOverSound.play().catch(e => console.warn("Game over sound play failed:", e));

    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}


function mainGameLoop() {
    if (isGameOver) return;

    changingDirection = false; // Allow direction change for next frame

    gameLoopTimeout = setTimeout(() => {
        if (checkGameOver()) {
            showGameOver();
            return;
        }

        clearCanvas();
        drawFood();
        moveSnake(); // Move must happen BEFORE drawing the snake at new position
        drawSnake();

        mainGameLoop(); // Schedule next frame
    }, gameSpeed);
}


// --- Event Listeners ---
document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', initializeGame);
restartButton.addEventListener('click', initializeGame);

// --- Initial Setup ---
startScreen.classList.remove('hidden');
gameOverScreen.classList.add('hidden');
clearCanvas(); // Initial clear