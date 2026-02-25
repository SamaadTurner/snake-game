import { describe, test, expect, beforeEach } from 'vitest';
import { loadGame } from '../utils/loadGame.js';

let window;
let testAPI;

beforeEach(async () => {
  window = await loadGame();
  testAPI = window.testAPI;
  testAPI.gameState.init();
});

describe('Food Spawning Bounds', () => {
  test('should always spawn food within grid bounds', () => {
    for (let i = 0; i < 50; i++) {
      testAPI.gameState.spawnFood();

      expect(testAPI.gameState.food.x).toBeGreaterThanOrEqual(0);
      expect(testAPI.gameState.food.x).toBeLessThan(testAPI.GRID_WIDTH);
      expect(testAPI.gameState.food.y).toBeGreaterThanOrEqual(0);
      expect(testAPI.gameState.food.y).toBeLessThan(testAPI.GRID_HEIGHT);
    }
  });

  test('should spawn food at valid grid coordinates', () => {
    for (let i = 0; i < 20; i++) {
      testAPI.gameState.spawnFood();

      expect(Number.isInteger(testAPI.gameState.food.x)).toBe(true);
      expect(Number.isInteger(testAPI.gameState.food.y)).toBe(true);
    }
  });

  test('should never spawn food beyond grid boundaries', () => {
    for (let i = 0; i < 50; i++) {
      testAPI.gameState.spawnFood();

      expect(testAPI.gameState.food.x).toBeLessThan(testAPI.GRID_WIDTH);
      expect(testAPI.gameState.food.y).toBeLessThan(testAPI.GRID_HEIGHT);
    }
  });
});

describe('Food Spawning Snake Avoidance', () => {
  test('should never spawn on snake head', () => {
    for (let i = 0; i < 30; i++) {
      testAPI.gameState.spawnFood();
      const head = testAPI.gameState.snake[0];

      const onHead = (testAPI.gameState.food.x === head.x &&
                      testAPI.gameState.food.y === head.y);

      expect(onHead).toBe(false);
    }
  });

  test('should never spawn on any snake body segment', () => {
    // Create a long snake
    testAPI.gameState.snake = [];
    for (let i = 0; i < 20; i++) {
      testAPI.gameState.snake.push({ x: i, y: 10 });
    }

    for (let attempt = 0; attempt < 30; attempt++) {
      testAPI.gameState.spawnFood();

      const onSnake = testAPI.gameState.snake.some(segment =>
        segment.x === testAPI.gameState.food.x &&
        segment.y === testAPI.gameState.food.y
      );

      expect(onSnake).toBe(false);
    }
  });

  test('should find valid position even with large snake', () => {
    // Fill half the grid with snake
    testAPI.gameState.snake = [];
    for (let x = 0; x < testAPI.GRID_WIDTH / 2; x++) {
      for (let y = 0; y < testAPI.GRID_HEIGHT; y++) {
        testAPI.gameState.snake.push({ x, y });
      }
    }

    testAPI.gameState.spawnFood();

    // Should spawn in the other half
    expect(testAPI.gameState.food.x).toBeGreaterThanOrEqual(testAPI.GRID_WIDTH / 2);
  });
});

describe('Food Spawning Randomness', () => {
  test('should produce distributed random positions', () => {
    const positions = new Map();
    const attempts = 100;

    for (let i = 0; i < attempts; i++) {
      testAPI.gameState.spawnFood();
      const key = `${testAPI.gameState.food.x},${testAPI.gameState.food.y}`;
      positions.set(key, (positions.get(key) || 0) + 1);
    }

    // Should have good variety (at least 30 unique positions)
    expect(positions.size).toBeGreaterThan(30);
  });

  test('should spawn new food coordinates on each call', () => {
    const firstFood = { ...testAPI.gameState.food };
    let differentFound = false;

    for (let i = 0; i < 20; i++) {
      testAPI.gameState.spawnFood();
      if (testAPI.gameState.food.x !== firstFood.x ||
          testAPI.gameState.food.y !== firstFood.y) {
        differentFound = true;
        break;
      }
    }

    expect(differentFound).toBe(true);
  });

  test('should not have strong position bias', () => {
    const positions = new Map();
    const attempts = 200;

    for (let i = 0; i < attempts; i++) {
      testAPI.gameState.spawnFood();
      const key = `${testAPI.gameState.food.x},${testAPI.gameState.food.y}`;
      positions.set(key, (positions.get(key) || 0) + 1);
    }

    // No single position should appear more than 5% of the time
    for (const count of positions.values()) {
      expect(count).toBeLessThan(attempts * 0.05);
    }
  });
});

describe('Food Spawning Edge Cases', () => {
  test('should work with minimal snake (single segment)', () => {
    testAPI.gameState.snake = [{ x: 10, y: 10 }];

    testAPI.gameState.spawnFood();

    expect(testAPI.gameState.food).toBeDefined();
    expect(testAPI.gameState.food.x !== 10 || testAPI.gameState.food.y !== 10).toBe(true);
  });

  test('should handle snake at grid boundaries', () => {
    testAPI.gameState.snake = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 }
    ];

    testAPI.gameState.spawnFood();

    expect(testAPI.gameState.food).toBeDefined();

    const onSnake = testAPI.gameState.snake.some(segment =>
      segment.x === testAPI.gameState.food.x &&
      segment.y === testAPI.gameState.food.y
    );

    expect(onSnake).toBe(false);
  });

  test('should return valid food object structure', () => {
    testAPI.gameState.spawnFood();

    expect(testAPI.gameState.food).toHaveProperty('x');
    expect(testAPI.gameState.food).toHaveProperty('y');
    expect(typeof testAPI.gameState.food.x).toBe('number');
    expect(typeof testAPI.gameState.food.y).toBe('number');
  });
});
