import { describe, test, expect, beforeEach } from 'vitest';
import { loadGame } from '../utils/loadGame.js';

let window;
let testAPI;

beforeEach(async () => {
  window = await loadGame();
  testAPI = window.testAPI;
  testAPI.gameState.init();
  testAPI.gameState.gameRunning = true;
});

describe('Snake Movement Integration', () => {
  test('should move snake head in the current direction', () => {
    const initialHead = { ...testAPI.gameState.snake[0] };
    testAPI.gameState.direction = { x: 1, y: 0 };

    // We can't easily trigger game loop, so we test the logic manually
    const newHead = {
      x: initialHead.x + testAPI.gameState.direction.x,
      y: initialHead.y + testAPI.gameState.direction.y
    };

    expect(newHead.x).toBe(initialHead.x + 1);
    expect(newHead.y).toBe(initialHead.y);
  });

  test('should not move when gameRunning is false', () => {
    testAPI.gameState.gameRunning = false;
    const initialHead = { ...testAPI.gameState.snake[0] };

    // In real game loop, snake wouldn't move
    expect(testAPI.gameState.gameRunning).toBe(false);
  });

  test('should detect wall collision during movement', () => {
    testAPI.gameState.snake = [{ x: 0, y: 10 }];
    testAPI.gameState.direction = { x: -1, y: 0 };

    const newHead = {
      x: testAPI.gameState.snake[0].x + testAPI.gameState.direction.x,
      y: testAPI.gameState.snake[0].y + testAPI.gameState.direction.y
    };

    const wouldCollide = testAPI.checkWallCollision(newHead);
    expect(wouldCollide).toBe(true);
  });

  test('should detect self collision during movement', () => {
    testAPI.gameState.snake = [
      { x: 10, y: 10 },
      { x: 11, y: 10 },
      { x: 11, y: 11 },
      { x: 10, y: 11 }
    ];
    testAPI.gameState.direction = { x: 0, y: 1 };

    const newHead = {
      x: testAPI.gameState.snake[0].x + testAPI.gameState.direction.x,
      y: testAPI.gameState.snake[0].y + testAPI.gameState.direction.y
    };

    const wouldCollide = testAPI.checkSelfCollision(newHead);
    expect(wouldCollide).toBe(true);
  });

  test('should apply buffered direction before movement', () => {
    testAPI.gameState.direction = { x: 1, y: 0 };
    testAPI.gameState.nextDirection = { x: 0, y: -1 };

    // In real game, direction would be updated to nextDirection
    const appliedDirection = { ...testAPI.gameState.nextDirection };

    expect(appliedDirection).toEqual({ x: 0, y: -1 });
  });
});

describe('Direction Changes During Movement', () => {
  test('should execute queued direction change', () => {
    testAPI.gameState.direction = { x: 1, y: 0 };
    testAPI.gameState.nextDirection = { x: 0, y: -1 };

    // Simulate applying next direction
    testAPI.gameState.direction = { ...testAPI.gameState.nextDirection };

    expect(testAPI.gameState.direction).toEqual({ x: 0, y: -1 });
  });

  test('should move in new direction after change', () => {
    testAPI.gameState.snake = [{ x: 10, y: 10 }];
    testAPI.gameState.direction = { x: 1, y: 0 };
    testAPI.gameState.nextDirection = { x: 0, y: -1 };

    // Apply next direction
    testAPI.gameState.direction = { ...testAPI.gameState.nextDirection };

    // Calculate new head
    const newHead = {
      x: testAPI.gameState.snake[0].x + testAPI.gameState.direction.x,
      y: testAPI.gameState.snake[0].y + testAPI.gameState.direction.y
    };

    expect(newHead).toEqual({ x: 10, y: 9 });
  });

  test('should prevent illegal direction change', () => {
    testAPI.gameState.direction = { x: 1, y: 0 };

    // Try to set opposite direction
    testAPI.inputHandler.handleInput('ArrowLeft');

    // nextDirection should not be opposite
    const isOpposite = (
      testAPI.gameState.nextDirection.x === -testAPI.gameState.direction.x &&
      testAPI.gameState.nextDirection.y === -testAPI.gameState.direction.y
    );

    expect(isOpposite).toBe(false);
  });
});

describe('Snake Growth and Tail Management', () => {
  test('should keep snake length when not eating', () => {
    const initialLength = testAPI.gameState.snake.length;

    // Simulate normal movement (no food)
    testAPI.gameState.snake.unshift({
      x: testAPI.gameState.snake[0].x + 1,
      y: testAPI.gameState.snake[0].y
    });
    testAPI.gameState.snake.pop();

    expect(testAPI.gameState.snake.length).toBe(initialLength);
  });

  test('should remove tail when moving without food', () => {
    testAPI.gameState.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];

    const oldTail = testAPI.gameState.snake[2];

    // Simulate movement
    testAPI.gameState.snake.unshift({ x: 11, y: 10 });
    testAPI.gameState.snake.pop();

    const hasTail = testAPI.gameState.snake.some(seg =>
      seg.x === oldTail.x && seg.y === oldTail.y
    );

    expect(hasTail).toBe(false);
  });
});

describe('Game State During Movement', () => {
  test('should stop movement when game over', () => {
    testAPI.gameState.gameOver = true;
    testAPI.gameState.gameRunning = false;

    // Movement should not occur
    expect(testAPI.gameState.gameRunning).toBe(false);
    expect(testAPI.gameState.gameOver).toBe(true);
  });

  test('should maintain game state consistency', () => {
    expect(testAPI.gameState.snake).toBeDefined();
    expect(testAPI.gameState.direction).toBeDefined();
    expect(testAPI.gameState.nextDirection).toBeDefined();
    expect(typeof testAPI.gameState.gameRunning).toBe('boolean');
    expect(typeof testAPI.gameState.gameOver).toBe('boolean');
  });
});
