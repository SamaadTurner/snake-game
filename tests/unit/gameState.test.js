import { describe, test, expect, beforeEach } from 'vitest';
import { loadGame } from '../utils/loadGame.js';

let window;
let testAPI;

beforeEach(async () => {
  window = await loadGame();
  testAPI = window.testAPI;
});

describe('GameState Initialization', () => {
  test('should initialize snake at center with single segment', () => {
    testAPI.gameState.init();

    expect(testAPI.gameState.snake).toHaveLength(1);
    expect(testAPI.gameState.snake[0]).toEqual({
      x: Math.floor(testAPI.GRID_WIDTH / 2),
      y: Math.floor(testAPI.GRID_HEIGHT / 2)
    });
  });

  test('should set initial direction to right', () => {
    testAPI.gameState.init();

    expect(testAPI.gameState.direction).toEqual({ x: 1, y: 0 });
    expect(testAPI.gameState.nextDirection).toEqual({ x: 1, y: 0 });
  });

  test('should reset score to 0', () => {
    testAPI.gameState.score = 100;
    testAPI.gameState.init();

    expect(testAPI.gameState.score).toBe(0);
  });

  test('should reset difficulty to 1', () => {
    testAPI.gameState.difficulty = 5;
    testAPI.gameState.init();

    expect(testAPI.gameState.difficulty).toBe(1);
  });

  test('should set speed to initial speed', () => {
    testAPI.gameState.speed = 50;
    testAPI.gameState.init();

    expect(testAPI.gameState.speed).toBe(100); // INITIAL_SPEED
  });

  test('should set gameRunning to false', () => {
    testAPI.gameState.gameRunning = true;
    testAPI.gameState.init();

    expect(testAPI.gameState.gameRunning).toBe(false);
  });

  test('should set gameOver to false', () => {
    testAPI.gameState.gameOver = true;
    testAPI.gameState.init();

    expect(testAPI.gameState.gameOver).toBe(false);
  });

  test('should spawn food after initialization', () => {
    testAPI.gameState.init();

    expect(testAPI.gameState.food).toBeDefined();
    expect(testAPI.gameState.food.x).toBeGreaterThanOrEqual(0);
    expect(testAPI.gameState.food.x).toBeLessThan(testAPI.GRID_WIDTH);
    expect(testAPI.gameState.food.y).toBeGreaterThanOrEqual(0);
    expect(testAPI.gameState.food.y).toBeLessThan(testAPI.GRID_HEIGHT);
  });
});

describe('Food Spawning', () => {
  beforeEach(() => {
    testAPI.gameState.init();
  });

  test('should spawn food within grid bounds', () => {
    for (let i = 0; i < 20; i++) {
      testAPI.gameState.spawnFood();

      expect(testAPI.gameState.food.x).toBeGreaterThanOrEqual(0);
      expect(testAPI.gameState.food.x).toBeLessThan(testAPI.GRID_WIDTH);
      expect(testAPI.gameState.food.y).toBeGreaterThanOrEqual(0);
      expect(testAPI.gameState.food.y).toBeLessThan(testAPI.GRID_HEIGHT);
    }
  });

  test('should not spawn food on snake body', () => {
    // Create a large snake
    testAPI.gameState.snake = [
      { x: 10, y: 10 },
      { x: 11, y: 10 },
      { x: 12, y: 10 }
    ];

    for (let i = 0; i < 20; i++) {
      testAPI.gameState.spawnFood();

      const onSnake = testAPI.gameState.snake.some(segment =>
        segment.x === testAPI.gameState.food.x &&
        segment.y === testAPI.gameState.food.y
      );

      expect(onSnake).toBe(false);
    }
  });

  test('should generate different positions on multiple calls', () => {
    const positions = new Set();

    for (let i = 0; i < 30; i++) {
      testAPI.gameState.spawnFood();
      positions.add(`${testAPI.gameState.food.x},${testAPI.gameState.food.y}`);
    }

    // Should have at least some variation
    expect(positions.size).toBeGreaterThan(1);
  });
});

describe('Food Collection', () => {
  beforeEach(() => {
    testAPI.gameState.init();
  });

  test('should increase score by 10', () => {
    const initialScore = testAPI.gameState.score;
    testAPI.gameState.collectFood();

    expect(testAPI.gameState.score).toBe(initialScore + testAPI.SCORE_PER_FOOD);
  });

  test('should spawn new food after collection', () => {
    const oldFood = { ...testAPI.gameState.food };
    testAPI.gameState.collectFood();

    // Food position should be defined
    expect(testAPI.gameState.food).toBeDefined();
    expect(typeof testAPI.gameState.food.x).toBe('number');
    expect(typeof testAPI.gameState.food.y).toBe('number');
  });

  test('should update difficulty at threshold', () => {
    testAPI.gameState.score = 45;
    testAPI.gameState.collectFood(); // Score becomes 55

    expect(testAPI.gameState.difficulty).toBe(2);
  });

  test('should update speed when difficulty changes', () => {
    testAPI.gameState.score = 45;
    testAPI.gameState.collectFood(); // Score becomes 55

    expect(testAPI.gameState.speed).toBe(85); // Level 2 speed
  });
});

describe('Difficulty Progression', () => {
  beforeEach(() => {
    testAPI.gameState.init();
  });

  test('should remain at level 1 for scores below 50', () => {
    testAPI.gameState.score = 30; // 30 + 10 = 40, still below threshold
    testAPI.gameState.collectFood();

    expect(testAPI.gameState.difficulty).toBe(1);
  });

  test('should reach level 2 at score 50', () => {
    testAPI.gameState.score = 40;
    testAPI.gameState.collectFood(); // 50

    expect(testAPI.gameState.difficulty).toBe(2);
  });

  test('should reach level 3 at score 100', () => {
    testAPI.gameState.score = 90;
    testAPI.gameState.collectFood(); // 100

    expect(testAPI.gameState.difficulty).toBe(3);
  });

  test('should cap at level 10', () => {
    testAPI.gameState.score = 1000;
    testAPI.gameState.collectFood();

    expect(testAPI.gameState.difficulty).toBe(10);
  });

  test('should never decrease difficulty', () => {
    testAPI.gameState.score = 200; // Level 5
    testAPI.gameState.collectFood();
    const level1 = testAPI.gameState.difficulty;

    testAPI.gameState.collectFood();
    const level2 = testAPI.gameState.difficulty;

    expect(level2).toBeGreaterThanOrEqual(level1);
  });
});
