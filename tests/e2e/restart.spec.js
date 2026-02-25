import { test, expect } from '@playwright/test';

test.describe('Snake Game - Restart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
  });

  test('should restart game when spacebar pressed after game over', async ({ page }) => {
    // Trigger game over
    await page.evaluate(() => {
      window.testAPI.gameState.score = 100;
      window.testAPI.gameState.difficulty = 5;
      window.testAPI.gameState.gameOver = true;
      window.testAPI.gameState.gameRunning = false;
      document.getElementById('gameOverOverlay').classList.add('active');
    });

    const overlay = page.locator('#gameOverOverlay');
    await expect(overlay).toHaveClass(/active/);

    // Press spacebar to restart
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Game over overlay should be hidden
    await expect(overlay).not.toHaveClass(/active/);

    // Score should be reset
    const score = page.locator('#score');
    await expect(score).toHaveText('0');

    // Difficulty should be reset
    const difficulty = page.locator('#difficulty');
    await expect(difficulty).toHaveText('1');
  });

  test('should reset snake to initial position after restart', async ({ page }) => {
    await page.keyboard.press('Space');
    await page.waitForTimeout(500); // Let snake move

    // Force game over
    await page.evaluate(() => {
      window.testAPI.gameState.gameOver = true;
      window.testAPI.gameState.gameRunning = false;
      document.getElementById('gameOverOverlay').classList.add('active');
    });

    // Restart
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Check snake is at center
    const snakePosition = await page.evaluate(() => ({
      x: window.testAPI.gameState.snake[0].x,
      y: window.testAPI.gameState.snake[0].y,
      length: window.testAPI.gameState.snake.length
    }));

    expect(snakePosition.length).toBe(1);
    expect(snakePosition.x).toBe(20); // GRID_WIDTH / 2
    expect(snakePosition.y).toBe(15); // GRID_HEIGHT / 2
  });

  test('should spawn new food after restart', async ({ page }) => {
    await page.evaluate(() => {
      window.testAPI.gameState.gameOver = true;
      window.testAPI.gameState.gameRunning = false;
      document.getElementById('gameOverOverlay').classList.add('active');
    });

    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Food should exist
    const hasFood = await page.evaluate(() => {
      return window.testAPI.gameState.food &&
             typeof window.testAPI.gameState.food.x === 'number' &&
             typeof window.testAPI.gameState.food.y === 'number';
    });

    expect(hasFood).toBe(true);
  });

  test('should show start message after restart', async ({ page }) => {
    await page.evaluate(() => {
      window.testAPI.gameState.gameOver = true;
      window.testAPI.gameState.gameRunning = false;
      document.getElementById('gameOverOverlay').classList.add('active');
    });

    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    const startMessage = page.locator('#startMessage');
    await expect(startMessage).toBeVisible();
  });

  test('should allow multiple restart cycles', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      // Start game
      await page.keyboard.press('Space');
      await page.waitForTimeout(100);

      // Force game over
      await page.evaluate(() => {
        window.testAPI.gameState.gameOver = true;
        window.testAPI.gameState.gameRunning = false;
        document.getElementById('gameOverOverlay').classList.add('active');
      });

      const overlay = page.locator('#gameOverOverlay');
      await expect(overlay).toHaveClass(/active/);

      // Restart
      await page.keyboard.press('Space');
      await page.waitForTimeout(100);

      await expect(overlay).not.toHaveClass(/active/);

      const score = page.locator('#score');
      await expect(score).toHaveText('0');
    }
  });

  test('should reset game state completely on restart', async ({ page }) => {
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);

    // Modify game state
    await page.evaluate(() => {
      window.testAPI.gameState.score = 250;
      window.testAPI.gameState.difficulty = 6;
      window.testAPI.gameState.speed = 45;
      window.testAPI.gameState.snake.push({ x: 5, y: 5 });
      window.testAPI.gameState.gameOver = true;
      window.testAPI.gameState.gameRunning = false;
      document.getElementById('gameOverOverlay').classList.add('active');
    });

    // Restart
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Verify complete reset
    const gameState = await page.evaluate(() => ({
      score: window.testAPI.gameState.score,
      difficulty: window.testAPI.gameState.difficulty,
      speed: window.testAPI.gameState.speed,
      snakeLength: window.testAPI.gameState.snake.length,
      gameRunning: window.testAPI.gameState.gameRunning,
      gameOver: window.testAPI.gameState.gameOver
    }));

    expect(gameState.score).toBe(0);
    expect(gameState.difficulty).toBe(1);
    expect(gameState.speed).toBe(100);
    expect(gameState.snakeLength).toBe(1);
    expect(gameState.gameRunning).toBe(false);
    expect(gameState.gameOver).toBe(false);
  });
});
