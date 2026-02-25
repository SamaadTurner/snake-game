import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads the game HTML file in JSDOM environment
 * @returns {Promise<Window>} The JSDOM window object with testAPI
 */
export async function loadGame() {
  const htmlPath = path.resolve(__dirname, '../../index.html');
  const cssPath = path.resolve(__dirname, '../../styles.css');
  const jsPath = path.resolve(__dirname, '../../game.js');

  const html = fs.readFileSync(htmlPath, 'utf-8');
  const css = fs.readFileSync(cssPath, 'utf-8');
  const js = fs.readFileSync(jsPath, 'utf-8');

  // Inject CSS and JS directly into HTML
  const htmlWithResources = html
    .replace('<link rel="stylesheet" href="styles.css">', `<style>${css}</style>`)
    .replace('<script src="game.js"></script>', `<script>${js}</script>`);

  const dom = new JSDOM(htmlWithResources, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost',
    pretendToBeVisual: true
  });

  // Wait for scripts to execute
  return new Promise((resolve) => {
    // Give the DOM time to initialize
    setTimeout(() => {
      resolve(dom.window);
    }, 100);
  });
}

/**
 * Resets the game state to initial conditions
 * @param {Window} window - The JSDOM window object
 */
export function resetGame(window) {
  if (window.testAPI && window.testAPI.gameState) {
    window.testAPI.gameState.init();
  }
}
