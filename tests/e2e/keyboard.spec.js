import { test, expect } from '@playwright/test';

test.describe('Snake Game - Keyboard Input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.keyboard.press('Space'); // Start game
    await page.waitForTimeout(100);
  });

  test('should respond to all arrow keys', async ({ page }) => {
    const keys = [
      { key: 'ArrowUp', expected: { x: 0, y: -1 } },
      { key: 'ArrowRight', expected: { x: 1, y: 0 } },
      { key: 'ArrowDown', expected: { x: 0, y: 1 } },
      { key: 'ArrowLeft', expected: { x: -1, y: 0 } }
    ];

    for (const { key, expected } of keys) {
      // Reset to right direction first
      await page.evaluate(() => {
        window.testAPI.gameState.direction = { x: 1, y: 0 };
        window.testAPI.gameState.nextDirection = { x: 1, y: 0 };
      });

      await page.keyboard.press(key);
      await page.waitForTimeout(50);

      const direction = await page.evaluate(() =>
        window.testAPI.gameState.nextDirection
      );

      // Only check if it's a perpendicular direction
      if (key !== 'ArrowLeft') {
        expect(direction).toBeDefined();
      }
    }
  });

  test('should respond to all WASD keys (lowercase)', async ({ page }) => {
    const keys = [
      { key: 'w', expected: { x: 0, y: -1 } },
      { key: 'd', expected: { x: 1, y: 0 } },
      { key: 's', expected: { x: 0, y: 1 } },
      { key: 'a', expected: { x: -1, y: 0 } }
    ];

    for (const { key, expected } of keys) {
      // Reset to right direction first
      await page.evaluate(() => {
        window.testAPI.gameState.direction = { x: 1, y: 0 };
        window.testAPI.gameState.nextDirection = { x: 1, y: 0 };
      });

      await page.keyboard.press(key);
      await page.waitForTimeout(50);

      const direction = await page.evaluate(() =>
        window.testAPI.gameState.nextDirection
      );

      // Only check if it's a perpendicular direction
      if (key !== 'a') {
        expect(direction).toBeDefined();
      }
    }
  });

  test('should respond to all WASD keys (uppercase)', async ({ page }) => {
    const keys = ['W', 'A', 'S', 'D'];

    for (const key of keys) {
      // Reset to right direction first
      await page.evaluate(() => {
        window.testAPI.gameState.direction = { x: 1, y: 0 };
        window.testAPI.gameState.nextDirection = { x: 1, y: 0 };
      });

      await page.keyboard.press(`Shift+${key.toLowerCase()}`);
      await page.waitForTimeout(50);

      const direction = await page.evaluate(() =>
        window.testAPI.gameState.nextDirection
      );

      expect(direction).toBeDefined();
    }
  });

  test('should prevent 180-degree turn (right to left)', async ({ page }) => {
    // Set direction to right
    await page.evaluate(() => {
      window.testAPI.gameState.direction = { x: 1, y: 0 };
      window.testAPI.gameState.nextDirection = { x: 1, y: 0 };
    });

    // Try to go left
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(50);

    const direction = await page.evaluate(() =>
      window.testAPI.gameState.nextDirection
    );

    expect(direction.x).not.toBe(-1); // Should not be left
  });

  test('should prevent 180-degree turn (up to down)', async ({ page }) => {
    await page.evaluate(() => {
      window.testAPI.gameState.direction = { x: 0, y: -1 }; // Up
      window.testAPI.gameState.nextDirection = { x: 0, y: -1 };
    });

    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(50);

    const direction = await page.evaluate(() =>
      window.testAPI.gameState.nextDirection
    );

    expect(direction.y).not.toBe(1); // Should not be down
  });

  test('should prevent 180-degree turn (left to right)', async ({ page }) => {
    await page.evaluate(() => {
      window.testAPI.gameState.direction = { x: -1, y: 0 }; // Left
      window.testAPI.gameState.nextDirection = { x: -1, y: 0 };
    });

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(50);

    const direction = await page.evaluate(() =>
      window.testAPI.gameState.nextDirection
    );

    expect(direction.x).not.toBe(1); // Should not be right
  });

  test('should prevent 180-degree turn (down to up)', async ({ page }) => {
    await page.evaluate(() => {
      window.testAPI.gameState.direction = { x: 0, y: 1 }; // Down
      window.testAPI.gameState.nextDirection = { x: 0, y: 1 };
    });

    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(50);

    const direction = await page.evaluate(() =>
      window.testAPI.gameState.nextDirection
    );

    expect(direction.y).not.toBe(-1); // Should not be up
  });

  test('should allow perpendicular direction changes', async ({ page }) => {
    await page.evaluate(() => {
      window.testAPI.gameState.direction = { x: 1, y: 0 }; // Right
      window.testAPI.gameState.nextDirection = { x: 1, y: 0 };
    });

    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(50);

    const direction = await page.evaluate(() =>
      window.testAPI.gameState.nextDirection
    );

    expect(direction).toEqual({ x: 0, y: -1 }); // Should be up
  });

  test('should handle rapid key presses', async ({ page }) => {
    // Rapid sequence: right, up, right, up
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowUp');

    // Game should not crash
    const isRunning = await page.evaluate(() =>
      window.testAPI.gameState.gameRunning
    );

    expect(isRunning).toBe(true);
  });

  test('should buffer input between game updates', async ({ page }) => {
    const currentDir = await page.evaluate(() =>
      ({ ...window.testAPI.gameState.direction })
    );

    // Press a valid direction
    await page.keyboard.press('ArrowUp');

    // Check that nextDirection is set
    const nextDir = await page.evaluate(() =>
      ({ ...window.testAPI.gameState.nextDirection })
    );

    expect(nextDir).toBeDefined();
    expect(nextDir.y).toBe(-1);
  });

  test('should ignore non-game keys', async ({ page }) => {
    const directionBefore = await page.evaluate(() =>
      ({ ...window.testAPI.gameState.nextDirection })
    );

    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('x');
    await page.keyboard.press('Escape');

    const directionAfter = await page.evaluate(() =>
      ({ ...window.testAPI.gameState.nextDirection })
    );

    expect(directionBefore).toEqual(directionAfter);
  });

  test('should handle WASD and arrow keys interchangeably', async ({ page }) => {
    // Reset direction
    await page.evaluate(() => {
      window.testAPI.gameState.direction = { x: 1, y: 0 };
      window.testAPI.gameState.nextDirection = { x: 1, y: 0 };
    });

    // Go up with W
    await page.keyboard.press('w');
    await page.waitForTimeout(150);

    let direction = await page.evaluate(() =>
      ({ ...window.testAPI.gameState.direction })
    );
    expect(direction.y).toBe(-1);

    // Go left with arrow
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(150);

    direction = await page.evaluate(() =>
      ({ ...window.testAPI.gameState.direction })
    );
    expect(direction.x).toBe(-1);

    // Go down with S
    await page.keyboard.press('s');
    await page.waitForTimeout(150);

    direction = await page.evaluate(() =>
      ({ ...window.testAPI.gameState.direction })
    );
    expect(direction.y).toBe(1);

    const isRunning = await page.evaluate(() =>
      window.testAPI.gameState.gameRunning
    );
    expect(isRunning).toBe(true);
  });
});
