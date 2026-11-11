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

    // Press up arrow. The new direction is applied on the next game tick,
    // so wait for it instead of sleeping for a fixed time.
    await page.keyboard.press('ArrowUp');
    await expect.poll(() =>
      page.evaluate(() => window.testAPI.gameState.direction.y)
    ).toBe(-1);

    const newDir = await page.evaluate(() => ({
      x: window.testAPI.gameState.direction.x,
      y: window.testAPI.gameState.direction.y
    }));

    expect(newDir).not.toEqual(initialDir);
    expect(newDir.y).toBe(-1); // Should be moving up
  });

  test('should increase score when eating food', async ({ page }) => {
    // Food normally spawns in a random spot, which made this test fail some runs.
    // Put the food a few cells in front of the snake so the result is always the same.
    await page.evaluate(() => {
      const state = window.testAPI.gameState;
      const head = state.snake[0];
      state.food = {
        x: head.x + state.direction.x * 3,
        y: head.y + state.direction.y * 3
      };
    });

    await page.keyboard.press('Space');

    // The snake keeps moving straight, so it should reach the food on its own
    const score = page.locator('#score');
    await expect(score).not.toHaveText('0', { timeout: 5000 });

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

    // A key press only takes effect on the next game tick, so wait for the
    // direction to change instead of sleeping for a fixed time.
    const getDirection = () =>
      page.evaluate(() => window.testAPI.gameState.direction);

    // Press W (up)
    await page.keyboard.press('w');
    await expect.poll(async () => (await getDirection()).y).toBe(-1);

    // Press D (right)
    await page.keyboard.press('d');
    await expect.poll(async () => (await getDirection()).x).toBe(1);
  });
});
