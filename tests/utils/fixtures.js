/**
 * Test fixtures and data for Snake game tests
 */

export const testScenarios = {
  wallCollisionLeft: {
    snake: [{ x: 0, y: 10 }],
    direction: { x: -1, y: 0 },
    expectedGameOver: true
  },

  wallCollisionRight: {
    snake: [{ x: 39, y: 10 }],
    direction: { x: 1, y: 0 },
    expectedGameOver: true
  },

  wallCollisionTop: {
    snake: [{ x: 10, y: 0 }],
    direction: { x: 0, y: -1 },
    expectedGameOver: true
  },

  wallCollisionBottom: {
    snake: [{ x: 10, y: 29 }],
    direction: { x: 0, y: 1 },
    expectedGameOver: true
  },

  selfCollision: {
    snake: [
      { x: 10, y: 10 },
      { x: 11, y: 10 },
      { x: 11, y: 11 },
      { x: 10, y: 11 }
    ],
    direction: { x: 0, y: 1 },
    expectedGameOver: true
  },

  foodCollection: {
    snake: [{ x: 10, y: 10 }],
    food: { x: 11, y: 10 },
    direction: { x: 1, y: 0 },
    expectedGrow: true,
    expectedScoreIncrease: 10
  },

  normalMovement: {
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    expectedNewHead: { x: 11, y: 10 },
    expectedGameOver: false
  }
};

export const difficultyTestCases = [
  { score: 0, level: 1, speed: 100 },
  { score: 50, level: 2, speed: 85 },
  { score: 100, level: 3, speed: 70 },
  { score: 150, level: 4, speed: 60 },
  { score: 200, level: 5, speed: 50 },
  { score: 250, level: 6, speed: 45 },
  { score: 300, level: 7, speed: 40 },
  { score: 350, level: 8, speed: 40 },
  { score: 400, level: 9, speed: 40 },
  { score: 500, level: 10, speed: 40 }
];

export const inputTestCases = {
  arrowKeys: [
    { key: 'ArrowUp', expected: { x: 0, y: -1 } },
    { key: 'ArrowDown', expected: { x: 0, y: 1 } },
    { key: 'ArrowLeft', expected: { x: -1, y: 0 } },
    { key: 'ArrowRight', expected: { x: 1, y: 0 } }
  ],

  wasdKeys: [
    { key: 'w', expected: { x: 0, y: -1 } },
    { key: 'W', expected: { x: 0, y: -1 } },
    { key: 's', expected: { x: 0, y: 1 } },
    { key: 'S', expected: { x: 0, y: 1 } },
    { key: 'a', expected: { x: -1, y: 0 } },
    { key: 'A', expected: { x: -1, y: 0 } },
    { key: 'd', expected: { x: 1, y: 0 } },
    { key: 'D', expected: { x: 1, y: 0 } }
  ],

  reversalPrevention: [
    { current: { x: 1, y: 0 }, input: 'ArrowLeft', shouldBlock: true },
    { current: { x: -1, y: 0 }, input: 'ArrowRight', shouldBlock: true },
    { current: { x: 0, y: 1 }, input: 'ArrowUp', shouldBlock: true },
    { current: { x: 0, y: -1 }, input: 'ArrowDown', shouldBlock: true }
  ]
};

export const gridConstants = {
  GRID_WIDTH: 40,
  GRID_HEIGHT: 30,
  GRID_SIZE: 20
};

export const mockCanvasContext = () => ({
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  clearRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  scale: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  globalAlpha: 1,
  font: '',
  textAlign: '',
  textBaseline: ''
});
