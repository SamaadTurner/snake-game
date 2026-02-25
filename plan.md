# Snake Game Implementation Plan

## Overview
Create a self-contained web-based snake game in a single HTML file using vanilla JavaScript and HTML5 Canvas. The game will feature dual input controls (arrow keys + WASD), score tracking, progressive difficulty, and polished visual design.

## File to Create
- **index.html** - Single file containing all HTML, CSS, and JavaScript

## Architecture

### Code Organization (within single file)
```
1. HTML Section
   - Canvas element (id="gameCanvas", 800x600px)
   - Score/difficulty display elements
   - Game over modal structure

2. CSS Section
   - Centered layout with flexbox
   - Dark theme color scheme
   - Game over overlay styling
   - Pulsing animation for food

3. JavaScript Section
   - Constants (grid size, speeds, colors)
   - Game State Manager
   - Rendering Engine
   - Input Handler
   - Collision Detector
   - Game Loop
```

### Core Components

#### 1. Game State Object
```javascript
gameState = {
  snake: [{x, y}, ...],      // Array of segments
  food: {x, y},              // Current food position
  direction: {x, y},         // Current movement direction
  nextDirection: {x, y},     // Buffered next direction
  score: 0,
  difficulty: 1,             // 1-10 levels
  speed: 100,                // Milliseconds between updates
  gameRunning: false,
  gameOver: false,
  lastUpdateTime: 0
}
```

#### 2. Grid System
- Canvas: 800x600 pixels
- Grid: 40x30 cells (20px per cell)
- All game entities use grid coordinates
- Rendering scales to pixel coordinates

#### 3. Dual Input System
Map both control schemes to same direction vectors:
- Arrow Keys: Up/Down/Left/Right
- WASD: W/A/S/D (case-insensitive)
- Buffered input prevents missed keypresses
- 180-degree reversal prevention
- Spacebar: Start/Restart game

#### 4. Collision Detection
Three collision types:
- **Wall collision**: Head outside grid bounds → Game Over
- **Self collision**: Head hits body segment → Game Over
- **Food collision**: Head reaches food → Grow snake, increase score

#### 5. Difficulty Progression
```
Score Thresholds → Difficulty Level → Speed (ms)
0-40:     Level 1  → 100ms
50-90:    Level 2  → 85ms
100-140:  Level 3  → 70ms
150-190:  Level 4  → 60ms
200-240:  Level 5  → 50ms
250-290:  Level 6  → 45ms
300+:     Level 7-10 → 40ms (capped)
```
- Each food: +10 points
- Speed increases as score increases
- Capped at 40ms to maintain playability

## Implementation Steps

### Phase 1: Foundation
1. Create HTML structure with canvas and UI elements
2. Set up CSS with dark theme and centered layout
3. Define JavaScript constants and gameState object

### Phase 2: Rendering
4. Implement canvas drawing functions:
   - Clear canvas
   - Draw snake (head in cyan, body in darker cyan)
   - Draw food (pink with pulsing animation)
   - Draw score/difficulty display
5. Create main render function

### Phase 3: Game Logic
6. Implement collision detection functions
7. Implement snake movement logic
8. Implement food spawning and collection

### Phase 4: Input & Control
9. Set up keyboard event listeners
10. Map arrow keys and WASD to direction vectors
11. Implement buffered input and reversal prevention

### Phase 5: Game Flow
12. Create game loop with requestAnimationFrame
13. Implement delta time tracking for frame-rate independence
14. Add game over detection and restart functionality

### Phase 6: Polish
15. Add food pulsing animation using Math.sin()
16. Style game over overlay with final score
17. Test all features and edge cases

## Visual Design

### Color Scheme
- Background: #1a1a2e (dark navy)
- Grid: #16213e (subtle)
- Snake head: #00d4ff (cyan)
- Snake body: #00a8cc (darker cyan)
- Food: #ff006e (bright pink)
- Text: #eaeaea (light gray)

### Animations
- Food pulsing: `0.8 + 0.2 * Math.sin(timestamp * 0.005)`
- Game over: Dark overlay fade-in

### UI Elements
- Score display: Top-left corner, monospace font
- Format: "Score: X | Level: Y"
- Game over modal: Centered, shows final score and restart instruction

## Key Technical Decisions

1. **Frame-rate independent updates**: Game logic updates at fixed intervals (based on difficulty), rendering at 60fps
2. **Buffered input**: Stores next direction to prevent input loss between game updates
3. **Grid-based coordinates**: Simplifies collision detection and classic snake feel
4. **Modular object structure**: Clean separation despite single-file constraint
5. **Progressive difficulty**: 10 levels with speed capping for balance

## Game Loop Structure
```javascript
function gameLoop(timestamp) {
  deltaTime = timestamp - lastUpdateTime;

  if (deltaTime >= gameState.speed && gameRunning && !gameOver) {
    // Apply buffered direction
    // Calculate new head position
    // Check collisions (wall, self, food)
    // Update snake position
    // Handle food collection
    lastUpdateTime = timestamp;
  }

  render(timestamp);  // Always render
  requestAnimationFrame(gameLoop);
}
```

## Testing Checklist
- Arrow key controls work correctly
- WASD controls work correctly
- Cannot reverse 180 degrees
- Wall collisions trigger game over
- Self collisions trigger game over
- Food spawns in valid positions
- Score increases correctly
- Difficulty progression works
- Speed increases appropriately
- Restart functionality works
- Visual animations display smoothly
