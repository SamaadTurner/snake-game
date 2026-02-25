import { describe, test, expect, beforeEach } from 'vitest';
import { loadGame } from '../utils/loadGame.js';
import { difficultyTestCases } from '../utils/fixtures.js';

let window;
let testAPI;

beforeEach(async () => {
  window = await loadGame();
  testAPI = window.testAPI;
  testAPI.gameState.init();
});

describe('Difficulty Levels', () => {
  test('should start at difficulty level 1', () => {
    expect(testAPI.gameState.difficulty).toBe(1);
    expect(testAPI.gameState.speed).toBe(100);
  });

  test('should progress to level 2 at score 50', () => {
    testAPI.gameState.score = 40;
    testAPI.gameState.collectFood(); // Score becomes 50

    expect(testAPI.gameState.difficulty).toBe(2);
    expect(testAPI.gameState.speed).toBe(85);
  });

  test('should progress to level 3 at score 100', () => {
    testAPI.gameState.score = 90;
    testAPI.gameState.collectFood(); // Score becomes 100

    expect(testAPI.gameState.difficulty).toBe(3);
    expect(testAPI.gameState.speed).toBe(70);
  });

  test('should progress to level 4 at score 150', () => {
    testAPI.gameState.score = 140;
    testAPI.gameState.collectFood(); // Score becomes 150

    expect(testAPI.gameState.difficulty).toBe(4);
    expect(testAPI.gameState.speed).toBe(60);
  });

  test('should progress to level 5 at score 200', () => {
    testAPI.gameState.score = 190;
    testAPI.gameState.collectFood(); // Score becomes 200

    expect(testAPI.gameState.difficulty).toBe(5);
    expect(testAPI.gameState.speed).toBe(50);
  });

  test('should progress to level 6 at score 250', () => {
    testAPI.gameState.score = 240;
    testAPI.gameState.collectFood(); // Score becomes 250

    expect(testAPI.gameState.difficulty).toBe(6);
    expect(testAPI.gameState.speed).toBe(45);
  });

  test('should progress to level 7 at score 300', () => {
    testAPI.gameState.score = 290;
    testAPI.gameState.collectFood(); // Score becomes 300

    expect(testAPI.gameState.difficulty).toBe(7);
    expect(testAPI.gameState.speed).toBe(40);
  });

  test('should progress to level 8 at score 350', () => {
    testAPI.gameState.score = 340;
    testAPI.gameState.collectFood(); // Score becomes 350

    expect(testAPI.gameState.difficulty).toBe(8);
    expect(testAPI.gameState.speed).toBe(40);
  });

  test('should progress to level 9 at score 400', () => {
    testAPI.gameState.score = 390;
    testAPI.gameState.collectFood(); // Score becomes 400

    expect(testAPI.gameState.difficulty).toBe(9);
    expect(testAPI.gameState.speed).toBe(40);
  });

  test('should reach max level 10 at score 500', () => {
    testAPI.gameState.score = 490;
    testAPI.gameState.collectFood(); // Score becomes 500

    expect(testAPI.gameState.difficulty).toBe(10);
    expect(testAPI.gameState.speed).toBe(40);
  });

  test('should stay at level 10 beyond score 500', () => {
    testAPI.gameState.score = 1000;
    testAPI.gameState.collectFood();

    expect(testAPI.gameState.difficulty).toBe(10);
    expect(testAPI.gameState.speed).toBe(40);
  });
});

describe('Speed Progression', () => {
  test('should decrease speed as difficulty increases', () => {
    const speeds = [];

    for (let i = 1; i <= 7; i++) {
      const threshold = testAPI.DIFFICULTY_THRESHOLDS[i];
      testAPI.gameState.score = threshold;
      testAPI.gameState.collectFood();
      speeds.push(testAPI.gameState.speed);
    }

    // Speeds should generally decrease (or stay same for levels 7-10)
    for (let i = 1; i < speeds.length - 1; i++) {
      expect(speeds[i]).toBeLessThanOrEqual(speeds[i - 1]);
    }
  });

  test('should cap speed at 40ms', () => {
    testAPI.gameState.score = 1000;
    testAPI.gameState.collectFood();

    expect(testAPI.gameState.speed).toBeGreaterThanOrEqual(40);
  });

  test('should apply correct speed for each level using fixtures', () => {
    difficultyTestCases.forEach(({ score, level, speed }) => {
      testAPI.gameState.init();
      testAPI.gameState.score = score;
      testAPI.gameState.collectFood();

      expect(testAPI.gameState.difficulty).toBe(level);
      expect(testAPI.gameState.speed).toBe(speed);
    });
  });
});

describe('Difficulty Thresholds', () => {
  test('should have correct difficulty thresholds defined', () => {
    expect(testAPI.DIFFICULTY_THRESHOLDS[1]).toBe(0);
    expect(testAPI.DIFFICULTY_THRESHOLDS[2]).toBe(50);
    expect(testAPI.DIFFICULTY_THRESHOLDS[3]).toBe(100);
    expect(testAPI.DIFFICULTY_THRESHOLDS[4]).toBe(150);
    expect(testAPI.DIFFICULTY_THRESHOLDS[5]).toBe(200);
    expect(testAPI.DIFFICULTY_THRESHOLDS[6]).toBe(250);
    expect(testAPI.DIFFICULTY_THRESHOLDS[7]).toBe(300);
    expect(testAPI.DIFFICULTY_THRESHOLDS[8]).toBe(350);
    expect(testAPI.DIFFICULTY_THRESHOLDS[9]).toBe(400);
    expect(testAPI.DIFFICULTY_THRESHOLDS[10]).toBe(500);
  });

  test('should never decrease difficulty', () => {
    testAPI.gameState.score = 200; // Level 5
    testAPI.gameState.collectFood();
    const level1 = testAPI.gameState.difficulty;

    testAPI.gameState.collectFood();
    const level2 = testAPI.gameState.difficulty;

    testAPI.gameState.collectFood();
    const level3 = testAPI.gameState.difficulty;

    expect(level2).toBeGreaterThanOrEqual(level1);
    expect(level3).toBeGreaterThanOrEqual(level2);
  });

  test('should maintain difficulty at same level between thresholds', () => {
    testAPI.gameState.score = 60; // Between threshold 2 (50) and 3 (100)
    testAPI.gameState.collectFood();

    const difficulty1 = testAPI.gameState.difficulty;

    testAPI.gameState.collectFood();
    const difficulty2 = testAPI.gameState.difficulty;

    expect(difficulty2).toBe(difficulty1);
  });
});
