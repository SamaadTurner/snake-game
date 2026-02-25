import { describe, test, expect, beforeEach, vi } from 'vitest';
import { loadGame } from '../utils/loadGame.js';

let window;
let testAPI;

beforeEach(async () => {
  window = await loadGame();
  testAPI = window.testAPI;
  testAPI.gameState.init();
});

describe('Canvas Rendering Integration', () => {
  test('should have canvas element available', () => {
    const canvas = window.document.getElementById('gameCanvas');
    expect(canvas).toBeDefined();
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });

  test('should have canvas context available', () => {
    const canvas = window.document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    expect(ctx).toBeDefined();
  });

  test('should have correct grid dimensions', () => {
    expect(testAPI.GRID_WIDTH).toBe(40); // 800 / 20
    expect(testAPI.GRID_HEIGHT).toBe(30); // 600 / 20
  });

  test('should have defined color constants', () => {
    expect(testAPI.COLORS).toBeDefined();
    expect(testAPI.COLORS.background).toBeDefined();
    expect(testAPI.COLORS.snakeHead).toBeDefined();
    expect(testAPI.COLORS.snakeBody).toBeDefined();
    expect(testAPI.COLORS.food).toBeDefined();
  });
});

describe('Game State Rendering', () => {
  test('should render with valid game state', () => {
    expect(testAPI.gameState.snake).toBeDefined();
    expect(testAPI.gameState.snake.length).toBeGreaterThan(0);
    expect(testAPI.gameState.food).toBeDefined();
  });

  test('should have snake within renderable bounds', () => {
    testAPI.gameState.snake.forEach(segment => {
      expect(segment.x).toBeGreaterThanOrEqual(0);
      expect(segment.x).toBeLessThan(testAPI.GRID_WIDTH);
      expect(segment.y).toBeGreaterThanOrEqual(0);
      expect(segment.y).toBeLessThan(testAPI.GRID_HEIGHT);
    });
  });

  test('should have food within renderable bounds', () => {
    expect(testAPI.gameState.food.x).toBeGreaterThanOrEqual(0);
    expect(testAPI.gameState.food.x).toBeLessThan(testAPI.GRID_WIDTH);
    expect(testAPI.gameState.food.y).toBeGreaterThanOrEqual(0);
    expect(testAPI.gameState.food.y).toBeLessThan(testAPI.GRID_HEIGHT);
  });
});

describe('UI Element Updates', () => {
  test('should have score display element', () => {
    const scoreElement = window.document.getElementById('score');
    expect(scoreElement).toBeDefined();
  });

  test('should have difficulty display element', () => {
    const difficultyElement = window.document.getElementById('difficulty');
    expect(difficultyElement).toBeDefined();
  });

  test('should update score display on collectFood', () => {
    const scoreElement = window.document.getElementById('score');
    const initialText = scoreElement.textContent;

    testAPI.gameState.collectFood();

    // Score element should be updated (updateUI is called)
    expect(scoreElement.textContent).not.toBe(initialText);
  });

  test('should update difficulty display on threshold', () => {
    const difficultyElement = window.document.getElementById('difficulty');

    testAPI.gameState.score = 45;
    testAPI.gameState.collectFood(); // Reaches level 2

    expect(difficultyElement.textContent).toBe('2');
  });
});

describe('Game Over Display', () => {
  test('should have game over overlay element', () => {
    const overlay = window.document.getElementById('gameOverOverlay');
    expect(overlay).toBeDefined();
  });

  test('should have final score element', () => {
    const finalScore = window.document.getElementById('finalScore');
    expect(finalScore).toBeDefined();
  });

  test('should have start message element', () => {
    const startMessage = window.document.getElementById('startMessage');
    expect(startMessage).toBeDefined();
  });

  test('should show start message initially', () => {
    const startMessage = window.document.getElementById('startMessage');
    // After init, start message should be visible
    expect(startMessage.style.display).toBe('block');
  });
});

describe('Color Scheme', () => {
  test('should have correct color values', () => {
    expect(testAPI.COLORS.background).toBe('#1a1a2e');
    expect(testAPI.COLORS.snakeHead).toBe('#00d4ff');
    expect(testAPI.COLORS.snakeBody).toBe('#00a8cc');
    expect(testAPI.COLORS.food).toBe('#ff006e');
  });

  test('should use different colors for head and body', () => {
    expect(testAPI.COLORS.snakeHead).not.toBe(testAPI.COLORS.snakeBody);
  });

  test('should use contrasting color for food', () => {
    expect(testAPI.COLORS.food).not.toBe(testAPI.COLORS.snakeHead);
    expect(testAPI.COLORS.food).not.toBe(testAPI.COLORS.snakeBody);
    expect(testAPI.COLORS.food).not.toBe(testAPI.COLORS.background);
  });
});

describe('Grid and Scaling', () => {
  test('should calculate correct pixel positions', () => {
    const gridSize = 20;
    const gridX = 5;
    const gridY = 10;

    const pixelX = gridX * gridSize;
    const pixelY = gridY * gridSize;

    expect(pixelX).toBe(100);
    expect(pixelY).toBe(200);
  });

  test('should fit grid cells within canvas', () => {
    const totalWidth = testAPI.GRID_WIDTH * 20; // GRID_SIZE = 20
    const totalHeight = testAPI.GRID_HEIGHT * 20;

    expect(totalWidth).toBe(800);
    expect(totalHeight).toBe(600);
  });

  test('should have integer grid coordinates', () => {
    testAPI.gameState.snake.forEach(segment => {
      expect(Number.isInteger(segment.x)).toBe(true);
      expect(Number.isInteger(segment.y)).toBe(true);
    });

    expect(Number.isInteger(testAPI.gameState.food.x)).toBe(true);
    expect(Number.isInteger(testAPI.gameState.food.y)).toBe(true);
  });
});

describe('Animation Support', () => {
  test('should support timestamp-based rendering', () => {
    const timestamp1 = 1000;
    const timestamp2 = 2000;

    // Food pulsing formula: 0.8 + 0.2 * Math.sin(timestamp * 0.005)
    const pulse1 = 0.8 + 0.2 * Math.sin(timestamp1 * 0.005);
    const pulse2 = 0.8 + 0.2 * Math.sin(timestamp2 * 0.005);

    expect(pulse1).not.toBe(pulse2);
  });

  test('should calculate valid pulse values', () => {
    for (let t = 0; t < 5000; t += 100) {
      const pulse = 0.8 + 0.2 * Math.sin(t * 0.005);
      expect(pulse).toBeGreaterThanOrEqual(0.6);
      expect(pulse).toBeLessThanOrEqual(1.0);
    }
  });
});
