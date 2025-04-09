# Flask Snake Xenzia Game 🐍

A modern take on the classic Snake Xenzia game, built with a Python Flask backend and HTML/CSS/JavaScript frontend. Features include smooth animations, sound effects, and a glowing retro aesthetic.

## Description

This project recreates the beloved Snake game experience within a web browser. The backend, powered by the lightweight Flask framework, primarily serves the static files (HTML, CSS, JS, sounds) that constitute the game interface and logic. All the real-time game mechanics run directly in the user's browser using vanilla JavaScript and the HTML5 Canvas API.

## Features ✨

* Classic Snake gameplay: Control the snake to eat food and grow longer.
* Score tracking: See your score increase as you eat food.
* Collision detection: Game ends if the snake hits the walls or itself.
* Smooth animations and movement.
* Enhanced UI: Retro "Press Start 2P" font, glowing effects on titles, scores, buttons, and the game canvas.
* Improved Snake visuals: Snake head now features eyes that orient based on direction.
* Sound Effects:
    * Background music during gameplay.
    * Sound effect when the snake eats food.
    * Game over sound effect.
* Start and Game Over screens with restart functionality.
* Responsive (basic centering, gameplay area is fixed size).

## Tech Stack 💻

* **Backend:** Python 3, Flask
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Graphics:** HTML5 Canvas API
* **Audio:** HTML5 `<audio>` API

## Project Structure 📁

```bash
snake-game/
├── app.py             # Flask application entry point
├── requirements.txt   # Python dependencies
├── static/            # Static assets served by Flask
│   ├── css/
│   │   └── style.css  # Stylesheet for UI and game elements
│   ├── js/
│   │   └── game.js    # Core JavaScript game logic
│   └── sounds/        # Sound effect files (MUST BE ADDED MANUALLY)
│       ├── eat.mp3
│       ├── gameover.mp3
│       └── background.mp3
└── templates/         # HTML templates rendered by Flask
│   └── index.html     # Main HTML page hosting the game
└── README.md          # This file
```
## Setup and Installation 🚀

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/KolwaBrad/Snake-Xenzia.git](https://github.com/KolwaBrad/Snake-Xenzia.git)
    cd snake-game
    ```

2.  **Create and Activate Virtual Environment (Recommended):**
    * **macOS/Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    * **Windows:**
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **❗ Add Sound Files:**
    This project uses sound effects. You **must** obtain your own `.mp3` (or compatible) sound files and place them inside the `static/sounds/` directory. Name them exactly:
    * `eat.mp3`
    * `gameover.mp3`
    * `background.mp3`
    *(You can find free sound effects on websites like Pixabay, ZapSplat, etc. - check licenses)*

## Running the Game ▶️

1.  **Start the Flask Server:**
    Make sure your virtual environment is activated.
    ```bash
    python app.py
    ```
    The server will start, usually on `http://127.0.0.1:5000/`.

2.  **Open in Browser:**
    Navigate to `http://127.0.0.1:5000/` (or the address provided in the terminal) in your web browser.

3.  **Play!**
    Click the "Start Game" button.

## Controls ⌨️

* Use the **Arrow Keys** (↑ ← ↓ →)
* _or_ **WASD Keys** (W A S D)
    ...to control the direction of the snake.

## License 📜

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (or add an MIT license file to your repo).

## Contributing (Optional)

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.