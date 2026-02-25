import { describe, test, expect, beforeAll } from 'vitest';
import { loadGame } from '../utils/loadGame.js';

let window;
let testAPI;

beforeAll(async () => {
  window = await loadGame();
  testAPI = window.testAPI;
});

describe('Wall Collision Detection', () => {
  test('should return false for head inside bounds', () => {
    const head = { x: 10, y: 10 };
    expect(testAPI.checkWallCollision(head)).toBe(false);
  });

  test('should return true when head x is negative', () => {
    const head = { x: -1, y: 10 };
    expect(testAPI.checkWallCollision(head)).toBe(true);
  });

  test('should return true when head x exceeds grid width', () => {
    const head = { x: testAPI.GRID_WIDTH, y: 10 };
    expect(testAPI.checkWallCollision(head)).toBe(true);
  });

  test('should return true when head y is negative', () => {
    const head = { x: 10, y: -1 };
    expect(testAPI.checkWallCollision(head)).toBe(true);
  });

  test('should return true when head y exceeds grid height', () => {
    const head = { x: 10, y: testAPI.GRID_HEIGHT };
    expect(testAPI.checkWallCollision(head)).toBe(true);
  });

  test('should return false at boundary edge (0,0)', () => {
    const head = { x: 0, y: 0 };
    expect(testAPI.checkWallCollision(head)).toBe(false);
  });

  test('should return false at boundary edge (max-1, max-1)', () => {
    const head = {
      x: testAPI.GRID_WIDTH - 1,
      y: testAPI.GRID_HEIGHT - 1
    };
    expect(testAPI.checkWallCollision(head)).toBe(false);
  });

  test('should return true for coordinates beyond right boundary', () => {
    const head = { x: testAPI.GRID_WIDTH + 5, y: 10 };
    expect(testAPI.checkWallCollision(head)).toBe(true);
  });

  test('should return true for coordinates beyond bottom boundary', () => {
    const head = { x: 10, y: testAPI.GRID_HEIGHT + 5 };
    expect(testAPI.checkWallCollision(head)).toBe(true);
  });
});

describe('Self Collision Detection', () => {
  test('should return false when snake has only head', () => {
    const head = { x: 10, y: 10 };
    expect(testAPI.checkSelfCollision(head)).toBe(false);
  });

  test('should return false when head does not overlap body', () => {
    // Store original snake
    const originalSnake = [...testAPI.gameState.snake];

    // Set up snake
    testAPI.gameState.snake = [
      { x: 9, y: 10 }, // This will be old head
      { x: 8, y: 10 },
      { x: 7, y: 10 }
    ];

    const newHead = { x: 10, y: 10 };
    const result = testAPI.checkSelfCollision(newHead);

    // Restore
    testAPI.gameState.snake = originalSnake;

    expect(result).toBe(false);
  });

  test('should return true when head overlaps with body segment', () => {
    const originalSnake = [...testAPI.gameState.snake];

    testAPI.gameState.snake = [
      { x: 10, y: 10 }, // Head
      { x: 11, y: 10 },
      { x: 12, y: 10 },
      { x: 12, y: 11 },
      { x: 11, y: 11 }
    ];

    // New head position collides with body
    const newHead = { x: 11, y: 10 };
    const result = testAPI.checkSelfCollision(newHead);

    testAPI.gameState.snake = originalSnake;

    expect(result).toBe(true);
  });

  test('should not detect collision with current head position', () => {
    const originalSnake = [...testAPI.gameState.snake];

    testAPI.gameState.snake = [
      { x: 10, y: 10 }, // Head
      { x: 9, y: 10 }
    ];

    const newHead = { x: 10, y: 10 };
    const result = testAPI.checkSelfCollision(newHead);

    testAPI.gameState.snake = originalSnake;

    expect(result).toBe(false);
  });
});

describe('Food Collision Detection', () => {
  test('should return true when head position matches food', () => {
    const head = { x: 15, y: 15 };
    const originalFood = { ...testAPI.gameState.food };

    testAPI.gameState.food = { x: 15, y: 15 };
    const result = testAPI.checkFoodCollision(head);

    testAPI.gameState.food = originalFood;

    expect(result).toBe(true);
  });

  test('should return false when x coordinates differ', () => {
    const head = { x: 15, y: 15 };
    const originalFood = { ...testAPI.gameState.food };

    testAPI.gameState.food = { x: 16, y: 15 };
    const result = testAPI.checkFoodCollision(head);

    testAPI.gameState.food = originalFood;

    expect(result).toBe(false);
  });

  test('should return false when y coordinates differ', () => {
    const head = { x: 15, y: 15 };
    const originalFood = { ...testAPI.gameState.food };

    testAPI.gameState.food = { x: 15, y: 16 };
    const result = testAPI.checkFoodCollision(head);

    testAPI.gameState.food = originalFood;

    expect(result).toBe(false);
  });

  test('should return false when both coordinates differ', () => {
    const head = { x: 15, y: 15 };
    const originalFood = { ...testAPI.gameState.food };

    testAPI.gameState.food = { x: 16, y: 16 };
    const result = testAPI.checkFoodCollision(head);

    testAPI.gameState.food = originalFood;

    expect(result).toBe(false);
  });

  test('should return false when positions are adjacent but not equal', () => {
    const head = { x: 10, y: 10 };
    const originalFood = { ...testAPI.gameState.food };

    testAPI.gameState.food = { x: 11, y: 10 };
    const result = testAPI.checkFoodCollision(head);

    testAPI.gameState.food = originalFood;

    expect(result).toBe(false);
  });
});
