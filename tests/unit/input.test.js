import { describe, test, expect, beforeEach } from 'vitest';
import { loadGame } from '../utils/loadGame.js';

let window;
let testAPI;

beforeEach(async () => {
  window = await loadGame();
  testAPI = window.testAPI;
  testAPI.gameState.init();
});

describe('Arrow Key Input', () => {
  test('should map ArrowUp to upward direction', () => {
    testAPI.inputHandler.handleInput('ArrowUp');
    expect(testAPI.gameState.nextDirection).toEqual({ x: 0, y: -1 });
  });

  test('should map ArrowDown to downward direction', () => {
    testAPI.inputHandler.handleInput('ArrowDown');
    expect(testAPI.gameState.nextDirection).toEqual({ x: 0, y: 1 });
  });

  test('should map ArrowLeft to left direction', () => {
    testAPI.gameState.direction = { x: 0, y: 1 }; // Moving down first
    testAPI.inputHandler.handleInput('ArrowLeft');
    expect(testAPI.gameState.nextDirection).toEqual({ x: -1, y: 0 });
  });

  test('should map ArrowRight to right direction', () => {
    testAPI.inputHandler.handleInput('ArrowRight');
    expect(testAPI.gameState.nextDirection).toEqual({ x: 1, y: 0 });
  });
});

describe('WASD Input', () => {
  test('should map w to upward direction', () => {
    testAPI.inputHandler.handleInput('w');
    expect(testAPI.gameState.nextDirection).toEqual({ x: 0, y: -1 });
  });

  test('should map W to upward direction', () => {
    testAPI.inputHandler.handleInput('W');
    expect(testAPI.gameState.nextDirection).toEqual({ x: 0, y: -1 });
  });

  test('should map s to downward direction', () => {
    testAPI.inputHandler.handleInput('s');
    expect(testAPI.gameState.nextDirection).toEqual({ x: 0, y: 1 });
  });

  test('should map S to downward direction', () => {
    testAPI.inputHandler.handleInput('S');
    expect(testAPI.gameState.nextDirection).toEqual({ x: 0, y: 1 });
  });

  test('should map a to left direction', () => {
    testAPI.gameState.direction = { x: 0, y: 1 }; // Moving down first
    testAPI.inputHandler.handleInput('a');
    expect(testAPI.gameState.nextDirection).toEqual({ x: -1, y: 0 });
  });

  test('should map A to left direction', () => {
    testAPI.gameState.direction = { x: 0, y: 1 }; // Moving down first
    testAPI.inputHandler.handleInput('A');
    expect(testAPI.gameState.nextDirection).toEqual({ x: -1, y: 0 });
  });

  test('should map d to right direction', () => {
    testAPI.inputHandler.handleInput('d');
    expect(testAPI.gameState.nextDirection).toEqual({ x: 1, y: 0 });
  });

  test('should map D to right direction', () => {
    testAPI.inputHandler.handleInput('D');
    expect(testAPI.gameState.nextDirection).toEqual({ x: 1, y: 0 });
  });
});

describe('180-Degree Reversal Prevention', () => {
  test('should prevent reversing from right to left', () => {
    testAPI.gameState.direction = { x: 1, y: 0 }; // Moving right
    testAPI.gameState.nextDirection = { x: 1, y: 0 };

    testAPI.inputHandler.handleInput('ArrowLeft');

    expect(testAPI.gameState.nextDirection.x).not.toBe(-1);
  });

  test('should prevent reversing from left to right', () => {
    testAPI.gameState.direction = { x: -1, y: 0 }; // Moving left
    testAPI.gameState.nextDirection = { x: -1, y: 0 };

    testAPI.inputHandler.handleInput('ArrowRight');

    expect(testAPI.gameState.nextDirection.x).not.toBe(1);
  });

  test('should prevent reversing from up to down', () => {
    testAPI.gameState.direction = { x: 0, y: -1 }; // Moving up
    testAPI.gameState.nextDirection = { x: 0, y: -1 };

    testAPI.inputHandler.handleInput('ArrowDown');

    expect(testAPI.gameState.nextDirection.y).not.toBe(1);
  });

  test('should prevent reversing from down to up', () => {
    testAPI.gameState.direction = { x: 0, y: 1 }; // Moving down
    testAPI.gameState.nextDirection = { x: 0, y: 1 };

    testAPI.inputHandler.handleInput('ArrowUp');

    expect(testAPI.gameState.nextDirection.y).not.toBe(-1);
  });

  test('should prevent reversal with WASD keys', () => {
    testAPI.gameState.direction = { x: 1, y: 0 }; // Moving right
    testAPI.gameState.nextDirection = { x: 1, y: 0 };

    testAPI.inputHandler.handleInput('a'); // Try to go left

    expect(testAPI.gameState.nextDirection.x).not.toBe(-1);
  });
});

describe('Perpendicular Direction Changes', () => {
  test('should allow changing from right to up', () => {
    testAPI.gameState.direction = { x: 1, y: 0 }; // Right
    testAPI.inputHandler.handleInput('ArrowUp');

    expect(testAPI.gameState.nextDirection).toEqual({ x: 0, y: -1 });
  });

  test('should allow changing from up to left', () => {
    testAPI.gameState.direction = { x: 0, y: -1 }; // Up
    testAPI.inputHandler.handleInput('ArrowLeft');

    expect(testAPI.gameState.nextDirection).toEqual({ x: -1, y: 0 });
  });

  test('should allow changing from left to down', () => {
    testAPI.gameState.direction = { x: -1, y: 0 }; // Left
    testAPI.inputHandler.handleInput('ArrowDown');

    expect(testAPI.gameState.nextDirection).toEqual({ x: 0, y: 1 });
  });

  test('should allow changing from down to right', () => {
    testAPI.gameState.direction = { x: 0, y: 1 }; // Down
    testAPI.inputHandler.handleInput('ArrowRight');

    expect(testAPI.gameState.nextDirection).toEqual({ x: 1, y: 0 });
  });
});

describe('Spacebar Input', () => {
  test('should start game when not running', () => {
    testAPI.gameState.gameRunning = false;
    testAPI.gameState.gameOver = false;

    testAPI.inputHandler.handleInput(' ');

    expect(testAPI.gameState.gameRunning).toBe(true);
  });

  test('should not start if already running', () => {
    testAPI.gameState.gameRunning = true;
    testAPI.gameState.gameOver = false;

    const wasRunning = testAPI.gameState.gameRunning;
    testAPI.inputHandler.handleInput(' ');

    expect(testAPI.gameState.gameRunning).toBe(wasRunning);
  });
});

describe('Invalid Input', () => {
  test('should ignore non-mapped keys', () => {
    const initialDirection = { ...testAPI.gameState.nextDirection };

    testAPI.inputHandler.handleInput('Enter');
    testAPI.inputHandler.handleInput('Tab');
    testAPI.inputHandler.handleInput('x');
    testAPI.inputHandler.handleInput('1');

    expect(testAPI.gameState.nextDirection).toEqual(initialDirection);
  });

  test('should not crash on undefined input', () => {
    expect(() => {
      testAPI.inputHandler.handleInput(undefined);
    }).not.toThrow();
  });

  test('should not crash on empty string', () => {
    expect(() => {
      testAPI.inputHandler.handleInput('');
    }).not.toThrow();
  });
});

describe('Input Buffering', () => {
  test('should buffer next direction separately from current', () => {
    testAPI.gameState.direction = { x: 1, y: 0 }; // Moving right
    testAPI.inputHandler.handleInput('ArrowUp'); // Buffer up

    expect(testAPI.gameState.direction).toEqual({ x: 1, y: 0 }); // Still right
    expect(testAPI.gameState.nextDirection).toEqual({ x: 0, y: -1 }); // Buffered up
  });

  test('should allow overwriting buffered input', () => {
    testAPI.gameState.direction = { x: 1, y: 0 };
    testAPI.inputHandler.handleInput('ArrowUp');
    testAPI.inputHandler.handleInput('ArrowDown');

    // Last valid input wins
    expect(testAPI.gameState.nextDirection).toEqual({ x: 0, y: 1 });
  });
});
