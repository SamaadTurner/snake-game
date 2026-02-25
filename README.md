# 🐍 Snake Game

<div align="center">

## [🎮 **PLAY NOW** 🎮](https://samaadturner.github.io/snake-game/)

Classic Snake game with modern web technologies

![Tests](https://img.shields.io/badge/tests-239%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-unit%20%2B%20integration%20%2B%20e2e-blue)

</div>

---

## 🎯 Features

- **Pause Controls** - Press `P` or `ESC` to pause/resume
- **Progressive Difficulty** - 10 levels that increase with your score
- **Keyboard Controls** - Use Arrow Keys or WASD
- **Responsive Design** - Clean, modern UI with smooth animations
- **Victory Condition** - Fill the entire grid to win!

## 🎮 How to Play

1. **[Click here to play](https://samaadturner.github.io/snake-game/)** or visit: `https://samaadturner.github.io/snake-game/`
2. Press `SPACE` to start
3. Use `Arrow Keys` or `WASD` to move
4. Eat food to grow and increase your score
5. Avoid hitting walls or yourself

## 🧪 Testing

Comprehensive test suite ensuring quality:

- **95 Unit Tests** - Core game logic
- **51 Integration Tests** - Component interactions
- **93 E2E Tests** - Full gameplay across Chrome, Firefox, Safari

```bash
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:e2e          # End-to-end tests
npm run test:all          # Run all tests
```

## 🚀 Run Locally

```bash
# Clone the repository
git clone https://github.com/SamaadTurner/snake-game.git
cd snake-game

# Install dependencies
npm install

# Start local server
npm run serve

# Open http://localhost:8080 in your browser
```

## 🛠️ Tech Stack

- **Vanilla JavaScript** - No frameworks, pure JS
- **HTML5 Canvas** - Smooth graphics rendering
- **CSS3** - Modern styling with animations
- **Vitest** - Fast unit testing
- **Playwright** - Cross-browser E2E testing
- **GitHub Actions** - Automated CI/CD

## 📊 Project Structure

```
snake-game/
├── index.html          # Game markup
├── styles.css          # Styling
├── game.js            # Game logic
├── tests/
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/          # End-to-end tests
└── .github/workflows/ # CI/CD pipeline
```

## 🎯 Best Practices Implemented

✅ Separated HTML/CSS/JS for maintainability
✅ Canvas context error handling
✅ Accessibility with ARIA labels
✅ Prevents infinite loops in food spawning
✅ Fixed delta time for smooth initial movement
✅ 100% E2E test pass rate
✅ Automated deployment pipeline

## 📝 License

MIT License - feel free to use this code for learning or your own projects!

---

<div align="center">

**[🎮 Play the Game](https://samaadturner.github.io/snake-game/)** | **[Report Bug](https://github.com/SamaadTurner/snake-game/issues)** | **[Request Feature](https://github.com/SamaadTurner/snake-game/issues)**

Made with ❤️ and tested with 💯

</div>
