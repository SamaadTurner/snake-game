// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRID_SIZE = 20;
const GRID_WIDTH = CANVAS_WIDTH / GRID_SIZE;
const GRID_HEIGHT = CANVAS_HEIGHT / GRID_SIZE;
const INITIAL_SPEED = 100;
const SCORE_PER_FOOD = 10;

// Difficulty thresholds and speeds
const DIFFICULTY_THRESHOLDS = {
    1: 0, 2: 50, 3: 100, 4: 150, 5: 200,
    6: 250, 7: 300, 8: 350, 9: 400, 10: 500
};

const SPEED_BY_DIFFICULTY = {
    1: 100, 2: 85, 3: 70, 4: 60, 5: 50,
    6: 45, 7: 40, 8: 40, 9: 40, 10: 40
};

// Colors
const COLORS = {
    background: '#1a1a2e',
    grid: '#16213e',
    snakeHead: '#00d4ff',
    snakeBody: '#00a8cc',
    food: '#ff006e',
    text: '#eaeaea'
};

// Canvas setup
const canvas = document.getElementById('gameCanvas');
let ctx = null;

// Try to get canvas context with error handling
try {
    ctx = canvas ? canvas.getContext('2d') : null;
} catch (e) {
    // In test environment, canvas might not be available
    console.warn('Canvas context not available:', e.message);
}

// Canvas context error handling (only in browser, not in test env)
if (!ctx && typeof window !== 'undefined' && !window.testAPI) {
    const container = document.querySelector('.game-container');
    if (container) {
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = 'color: #ff006e; font-size: 1.5em; text-align: center; padding: 40px;';
        errorMessage.textContent = 'Error: Canvas 2D context not supported in your browser. Please try a different browser.';
        container.appendChild(errorMessage);
    }
}

// Game State
const gameState = {
    snake: [],
    food: { x: 0, y: 0 },
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    difficulty: 1,
    speed: INITIAL_SPEED,
    gameRunning: false,
    gameOver: false,
    gamePaused: false,
    lastUpdateTime: 0,

    init() {
        this.snake = [
            { x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.difficulty = 1;
        this.speed = INITIAL_SPEED;
        this.gameRunning = false;
        this.gameOver = false;
        this.gamePaused = false;
        this.lastUpdateTime = 0;
        this.spawnFood();
        this.updateUI();
        document.getElementById('gameOverOverlay').classList.remove('active');
        document.getElementById('startMessage').style.display = 'block';
        document.getElementById('pauseOverlay').classList.remove('active');
    },

    spawnFood() {
        const maxAttempts = GRID_WIDTH * GRID_HEIGHT;
        let attempts = 0;
        let newFood;

        do {
            if (attempts++ > maxAttempts) {
                // Snake has filled the grid - player wins!
                this.handleVictory();
                return;
            }
            newFood = {
                x: Math.floor(Math.random() * GRID_WIDTH),
                y: Math.floor(Math.random() * GRID_HEIGHT)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

        this.food = newFood;
    },

    handleVictory() {
        this.gameOver = true;
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score + ' - PERFECT GAME!';
        document.getElementById('gameOverOverlay').classList.add('active');
    },

    collectFood() {
        this.score += SCORE_PER_FOOD;

        // Update difficulty
        for (let level = 10; level >= 1; level--) {
            if (this.score >= DIFFICULTY_THRESHOLDS[level]) {
                this.difficulty = level;
                this.speed = SPEED_BY_DIFFICULTY[level];
                break;
            }
        }

        this.updateUI();
        this.spawnFood();
    },

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('difficulty').textContent = this.difficulty;
    },

    togglePause() {
        if (this.gameOver || !this.gameRunning) return;

        this.gamePaused = !this.gamePaused;
        const pauseOverlay = document.getElementById('pauseOverlay');

        if (this.gamePaused) {
            pauseOverlay.classList.add('active');
        } else {
            pauseOverlay.classList.remove('active');
        }
    }
};

// Collision Detection
function checkWallCollision(head) {
    return head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT;
}

function checkSelfCollision(head) {
    return gameState.snake.slice(1).some(segment =>
        segment.x === head.x && segment.y === head.y
    );
}

function checkFoodCollision(head) {
    return head.x === gameState.food.x && head.y === gameState.food.y;
}

// Input Handler
const inputHandler = {
    init() {
        window.addEventListener('keydown', (e) => {
            this.handleInput(e.key);
        });
    },

    handleInput(key) {
        const keyToDirection = {
            'ArrowUp': { x: 0, y: -1 },
            'ArrowDown': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 },
            'ArrowRight': { x: 1, y: 0 },
            'w': { x: 0, y: -1 },
            'W': { x: 0, y: -1 },
            'a': { x: -1, y: 0 },
            'A': { x: -1, y: 0 },
            's': { x: 0, y: 1 },
            'S': { x: 0, y: 1 },
            'd': { x: 1, y: 0 },
            'D': { x: 1, y: 0 }
        };

        if (key in keyToDirection) {
            const newDir = keyToDirection[key];
            // Prevent 180-degree reversal
            if (!(newDir.x === -gameState.direction.x && newDir.y === -gameState.direction.y)) {
                gameState.nextDirection = newDir;
            }
        }

        // Spacebar to start/restart
        if (key === ' ') {
            if (gameState.gameOver) {
                gameState.init();
            } else if (!gameState.gameRunning) {
                gameState.gameRunning = true;
                document.getElementById('startMessage').style.display = 'none';
            }
        }

        // Pause with P or Escape
        if (key === 'p' || key === 'P' || key === 'Escape') {
            gameState.togglePause();
        }
    }
};

// Rendering Engine
function clearCanvas() {
    if (!ctx) return;
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawGrid() {
    if (!ctx) return;
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= GRID_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * GRID_SIZE, 0);
        ctx.lineTo(x * GRID_SIZE, CANVAS_HEIGHT);
        ctx.stroke();
    }

    for (let y = 0; y <= GRID_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * GRID_SIZE);
        ctx.lineTo(CANVAS_WIDTH, y * GRID_SIZE);
        ctx.stroke();
    }
}

function drawSnake() {
    if (!ctx) return;
    gameState.snake.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snakeBody;

        ctx.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );

        if (isHead) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                segment.x * GRID_SIZE + 1,
                segment.y * GRID_SIZE + 1,
                GRID_SIZE - 2,
                GRID_SIZE - 2
            );
        }
    });
}

function drawFood(timestamp) {
    if (!ctx) return;
    const pulse = 0.8 + 0.2 * Math.sin(timestamp * 0.005);
    const size = GRID_SIZE * pulse;
    const offset = (GRID_SIZE - size) / 2;

    ctx.fillStyle = COLORS.food;
    ctx.fillRect(
        gameState.food.x * GRID_SIZE + offset,
        gameState.food.y * GRID_SIZE + offset,
        size,
        size
    );
}

function render(timestamp) {
    clearCanvas();
    drawGrid();
    drawFood(timestamp);
    drawSnake();
}

// Game Loop
function gameLoop(timestamp) {
    // Fix first frame delta time issue
    if (gameState.lastUpdateTime === 0) {
        gameState.lastUpdateTime = timestamp;
    }

    const deltaTime = timestamp - gameState.lastUpdateTime;

    if (deltaTime >= gameState.speed && gameState.gameRunning && !gameState.gameOver && !gameState.gamePaused) {
        // Apply buffered direction
        gameState.direction = { ...gameState.nextDirection };

        // Calculate new head position
        const newHead = {
            x: gameState.snake[0].x + gameState.direction.x,
            y: gameState.snake[0].y + gameState.direction.y
        };

        // Check collisions
        if (checkWallCollision(newHead) || checkSelfCollision(newHead)) {
            gameState.gameOver = true;
            gameState.gameRunning = false;
            document.getElementById('finalScore').textContent = gameState.score;
            document.getElementById('gameOverOverlay').classList.add('active');
        } else {
            // Add new head
            gameState.snake.unshift(newHead);

            // Check if food collected
            if (checkFoodCollision(newHead)) {
                gameState.collectFood();
            } else {
                // Remove tail (normal movement)
                gameState.snake.pop();
            }
        }

        gameState.lastUpdateTime = timestamp;
    }

    render(timestamp);
    requestAnimationFrame(gameLoop);
}

// Initialize game
gameState.init();
inputHandler.init();
requestAnimationFrame(gameLoop);

// Expose functions for testing
if (typeof window !== 'undefined') {
    window.testAPI = {
        // Game state
        gameState,
        // Input handler
        inputHandler,
        // Functions
        checkWallCollision,
        checkSelfCollision,
        checkFoodCollision,
        // Constants
        GRID_WIDTH,
        GRID_HEIGHT,
        DIFFICULTY_THRESHOLDS,
        SPEED_BY_DIFFICULTY,
        SCORE_PER_FOOD,
        COLORS
    };
}
