import { test, expect } from '@playwright/test';

test.describe('Snake Game - Full Gameplay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
  });

  test('should load game with initial state', async ({ page }) => {
    // Check canvas is visible
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();

    // Check score is 0
    const score = page.locator('#score');
    await expect(score).toHaveText('0');

    // Check difficulty is 1
    const difficulty = page.locator('#difficulty');
    await expect(difficulty).toHaveText('1');

    // Check start message is visible
    const startMessage = page.locator('#startMessage');
    await expect(startMessage).toBeVisible();
  });

  test('should start game when spacebar is pressed', async ({ page }) => {
    const startMessage = page.locator('#startMessage');

    await expect(startMessage).toBeVisible();

    await page.keyboard.press('Space');

    // Start message should hide
    await expect(startMessage).not.toBeVisible();
  });

  test('should move snake continuously after starting', async ({ page }) => {
    await page.keyboard.press('Space');

    // Take snapshot of canvas
    const canvas = page.locator('#gameCanvas');
    const screenshot1 = await canvas.screenshot();

    // Wait for movement
    await page.waitForTimeout(200);

    const screenshot2 = await canvas.screenshot();

    // Screenshots should be different (snake moved)
    expect(screenshot1.length).toBeGreaterThan(0);
    expect(screenshot2.length).toBeGreaterThan(0);
    // They should be different due to movement
    expect(screenshot1.equals(screenshot2)).toBe(false);
  });

  test('should change direction with arrow keys', async ({ page }) => {
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Get initial direction
    const initialDir = await page.evaluate(() => ({
      x: window.testAPI.gameState.direction.x,
      y: window.testAPI.gameState.direction.y
    }));

    // Press up arrow
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(150);

    // Direction should have changed
    const newDir = await page.evaluate(() => ({
      x: window.testAPI.gameState.direction.x,
      y: window.testAPI.gameState.direction.y
    }));

    expect(newDir).not.toEqual(initialDir);
    expect(newDir.y).toBe(-1); // Should be moving up
  });

  test('should increase score when eating food', async ({ page }) => {
    await page.keyboard.press('Space');

    const score = page.locator('#score');

    // Actively guide snake to food
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const currentScore = await page.evaluate(() =>
        parseInt(document.getElementById('score').textContent)
      );

      if (currentScore > 0) {
        break;
      }

      // Get snake and food positions
      const gameData = await page.evaluate(() => ({
        snake: window.testAPI.gameState.snake[0],
        food: window.testAPI.gameState.food,
        gameOver: window.testAPI.gameState.gameOver
      }));

      if (gameData.gameOver) {
        throw new Error('Game ended before reaching food');
      }

      // Calculate direction to food
      const dx = gameData.food.x - gameData.snake.x;
      const dy = gameData.food.y - gameData.snake.y;

      // Move towards food (prefer horizontal movement first)
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          await page.keyboard.press('ArrowRight');
        } else {
          await page.keyboard.press('ArrowLeft');
        }
      } else {
        if (dy > 0) {
          await page.keyboard.press('ArrowDown');
        } else {
          await page.keyboard.press('ArrowUp');
        }
      }

      await page.waitForTimeout(150);
      attempts++;
    }

    const newScore = await score.textContent();
    expect(parseInt(newScore)).toBeGreaterThan(0);
  });

  test('should render snake and food on canvas', async ({ page }) => {
    // Get canvas pixel data to verify rendering
    const hasRenderedContent = await page.evaluate(() => {
      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Check if any non-background pixels exist
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        // Not pure background color (#1a1a2e)
        if (r !== 26 || g !== 26 || b !== 46) {
          return true;
        }
      }
      return false;
    });

    expect(hasRenderedContent).toBe(true);
  });

  test('should display food with pulsing animation', async ({ page }) => {
    await page.keyboard.press('Space');

    // Capture multiple frames
    const canvas = page.locator('#gameCanvas');
    const frames = [];

    for (let i = 0; i < 5; i++) {
      frames.push(await canvas.screenshot());
      await page.waitForTimeout(100);
    }

    // At least some frames should differ (animation)
    const uniqueFrames = new Set(frames.map(f => f.toString()));
    expect(uniqueFrames.size).toBeGreaterThan(1);
  });

  test('should use WASD keys for movement', async ({ page }) => {
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Press W (up)
    await page.keyboard.press('w');
    await page.waitForTimeout(150);

    const directionW = await page.evaluate(() =>
      window.testAPI.gameState.direction
    );
    expect(directionW.y).toBe(-1); // Moving up

    // Press D (right)
    await page.keyboard.press('d');
    await page.waitForTimeout(150);

    const directionD = await page.evaluate(() =>
      window.testAPI.gameState.direction
    );
    expect(directionD.x).toBe(1); // Moving right
  });
});
