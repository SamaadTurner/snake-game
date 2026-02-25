/**
 * Creates a snake at specified position with given length
 * @param {number} x - Head x position
 * @param {number} y - Head y position
 * @param {number} length - Snake length
 * @param {object} direction - Direction (defaults to right)
 * @returns {Array} Snake array
 */
export function createSnake(x, y, length = 3, direction = { x: 1, y: 0 }) {
  const snake = [{ x, y }];

  for (let i = 1; i < length; i++) {
    const prevSegment = snake[i - 1];
    snake.push({
      x: prevSegment.x - direction.x,
      y: prevSegment.y - direction.y
    });
  }

  return snake;
}

/**
 * Places food at specified position
 * @param {object} gameState - Game state object
 * @param {number} x - Food x position
 * @param {number} y - Food y position
 */
export function placeFood(gameState, x, y) {
  gameState.food = { x, y };
}

/**
 * Sets snake direction
 * @param {object} gameState - Game state object
 * @param {object} direction - Direction object {x, y}
 */
export function setDirection(gameState, direction) {
  gameState.direction = { ...direction };
  gameState.nextDirection = { ...direction };
}

/**
 * Checks if position is occupied by snake
 * @param {Array} snake - Snake array
 * @param {number} x - X position
 * @param {number} y - Y position
 * @returns {boolean}
 */
export function isPositionOnSnake(snake, x, y) {
  return snake.some(segment => segment.x === x && segment.y === y);
}

/**
 * Triggers game over state
 * @param {object} gameState - Game state object
 */
export function triggerGameOver(gameState) {
  gameState.gameOver = true;
  gameState.gameRunning = false;
}

/**
 * Gets snake head position
 * @param {Array} snake - Snake array
 * @returns {object} Head position {x, y}
 */
export function getHead(snake) {
  return snake[0];
}

/**
 * Gets snake tail position
 * @param {Array} snake - Snake array
 * @returns {object} Tail position {x, y}
 */
export function getTail(snake) {
  return snake[snake.length - 1];
}

/**
 * Waits for a condition to be true
 * @param {Function} condition - Condition function
 * @param {number} timeout - Timeout in ms
 * @returns {Promise<boolean>}
 */
export async function waitFor(condition, timeout = 5000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  return false;
}
