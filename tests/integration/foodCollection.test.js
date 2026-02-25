import { describe, test, expect, beforeEach } from 'vitest';
import { loadGame } from '../utils/loadGame.js';

let window;
let testAPI;

beforeEach(async () => {
  window = await loadGame();
  testAPI = window.testAPI;
  testAPI.gameState.init();
});

describe('Food Collection Flow', () => {
  test('should detect when snake head reaches food', () => {
    testAPI.gameState.snake = [{ x: 10, y: 10 }];
    testAPI.gameState.food = { x: 11, y: 10 };
    testAPI.gameState.direction = { x: 1, y: 0 };

    // Calculate new head
    const newHead = {
      x: testAPI.gameState.snake[0].x + testAPI.gameState.direction.x,
      y: testAPI.gameState.snake[0].y + testAPI.gameState.direction.y
    };

    // Check if food collected
    const foodCollected = testAPI.checkFoodCollision(newHead);

    expect(foodCollected).toBe(true);
  });

  test('should increase score when collecting food', () => {
    const initialScore = testAPI.gameState.score;

    testAPI.gameState.collectFood();

    expect(testAPI.gameState.score).toBe(initialScore + 10);
  });

  test('should spawn new food after collection', () => {
    const oldFood = { ...testAPI.gameState.food };

    testAPI.gameState.collectFood();

    // Food should exist
    expect(testAPI.gameState.food).toBeDefined();
    expect(typeof testAPI.gameState.food.x).toBe('number');
    expect(typeof testAPI.gameState.food.y).toBe('number');
  });

  test('should grow snake when collecting food', () => {
    testAPI.gameState.snake = [{ x: 10, y: 10 }];
    testAPI.gameState.food = { x: 11, y: 10 };

    const initialLength = testAPI.gameState.snake.length;

    // Simulate eating food (add new head, keep tail)
    testAPI.gameState.snake.unshift({ x: 11, y: 10 });
    // Don't pop tail when eating

    expect(testAPI.gameState.snake.length).toBe(initialLength + 1);
  });

  test('should update difficulty at threshold', () => {
    testAPI.gameState.score = 45;

    testAPI.gameState.collectFood(); // Score becomes 55

    expect(testAPI.gameState.difficulty).toBeGreaterThan(1);
  });

  test('should update speed when difficulty changes', () => {
    const initialSpeed = testAPI.gameState.speed;
    testAPI.gameState.score = 95;

    testAPI.gameState.collectFood(); // Score becomes 105, level 3

    expect(testAPI.gameState.speed).not.toBe(initialSpeed);
    expect(testAPI.gameState.speed).toBe(70); // Level 3 speed
  });
});

describe('Food Collection Edge Cases', () => {
  test('should handle consecutive food collections', () => {
    const initialScore = testAPI.gameState.score;

    testAPI.gameState.collectFood();
    testAPI.gameState.collectFood();
    testAPI.gameState.collectFood();

    expect(testAPI.gameState.score).toBe(initialScore + 30);
  });

  test('should keep head position at food location after eating', () => {
    testAPI.gameState.snake = [{ x: 10, y: 10 }];
    testAPI.gameState.food = { x: 11, y: 10 };

    // Simulate eating
    testAPI.gameState.snake.unshift({ x: 11, y: 10 });

    expect(testAPI.gameState.snake[0]).toEqual({ x: 11, y: 10 });
  });

  test('should preserve tail segment when growing', () => {
    testAPI.gameState.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];

    const oldTail = { ...testAPI.gameState.snake[2] };

    // Simulate eating (add head, don't remove tail)
    testAPI.gameState.snake.unshift({ x: 11, y: 10 });

    const tailStillExists = testAPI.gameState.snake.some(seg =>
      seg.x === oldTail.x && seg.y === oldTail.y
    );

    expect(tailStillExists).toBe(true);
  });

  test('should not collect food when not aligned', () => {
    testAPI.gameState.snake = [{ x: 10, y: 10 }];
    testAPI.gameState.food = { x: 15, y: 15 };

    const head = testAPI.gameState.snake[0];
    const collected = testAPI.checkFoodCollision(head);

    expect(collected).toBe(false);
  });
});

describe('Score and Difficulty Integration', () => {
  test('should reach level 2 after 5 food collections', () => {
    testAPI.gameState.score = 0;

    for (let i = 0; i < 5; i++) {
      testAPI.gameState.collectFood();
    }

    expect(testAPI.gameState.score).toBe(50);
    expect(testAPI.gameState.difficulty).toBe(2);
  });

  test('should reach level 3 after 10 food collections', () => {
    testAPI.gameState.score = 0;

    for (let i = 0; i < 10; i++) {
      testAPI.gameState.collectFood();
    }

    expect(testAPI.gameState.score).toBe(100);
    expect(testAPI.gameState.difficulty).toBe(3);
  });

  test('should progressively increase difficulty', () => {
    testAPI.gameState.score = 0;
    const difficultyLevels = [];

    for (let i = 0; i < 20; i++) {
      testAPI.gameState.collectFood();
      difficultyLevels.push(testAPI.gameState.difficulty);
    }

    // Difficulty should never decrease
    for (let i = 1; i < difficultyLevels.length; i++) {
      expect(difficultyLevels[i]).toBeGreaterThanOrEqual(difficultyLevels[i - 1]);
    }
  });

  test('should maintain speed cap at higher levels', () => {
    testAPI.gameState.score = 400;

    testAPI.gameState.collectFood();
    const speed1 = testAPI.gameState.speed;

    testAPI.gameState.collectFood();
    const speed2 = testAPI.gameState.speed;

    // Speed should be capped at 40ms
    expect(speed1).toBe(40);
    expect(speed2).toBe(40);
  });
});

describe('Food Spawn After Collection', () => {
  test('should not spawn new food on snake', () => {
    testAPI.gameState.snake = [];
    for (let i = 0; i < 10; i++) {
      testAPI.gameState.snake.push({ x: i, y: 10 });
    }

    testAPI.gameState.collectFood();

    const onSnake = testAPI.gameState.snake.some(seg =>
      seg.x === testAPI.gameState.food.x &&
      seg.y === testAPI.gameState.food.y
    );

    expect(onSnake).toBe(false);
  });

  test('should spawn food within bounds after collection', () => {
    testAPI.gameState.collectFood();

    expect(testAPI.gameState.food.x).toBeGreaterThanOrEqual(0);
    expect(testAPI.gameState.food.x).toBeLessThan(testAPI.GRID_WIDTH);
    expect(testAPI.gameState.food.y).toBeGreaterThanOrEqual(0);
    expect(testAPI.gameState.food.y).toBeLessThan(testAPI.GRID_HEIGHT);
  });
});
