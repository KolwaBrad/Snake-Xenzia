# snake-game/app.py
from flask import Flask, render_template

# Initialize the Flask application
app = Flask(__name__)

# Define the main route for the game
@app.route('/')
def index():
  """Serves the main HTML page for the game."""
  # Renders the index.html file located in the 'templates' folder
  return render_template('index.html')

# Run the Flask development server
if __name__ == '__main__':
  # debug=True allows for automatic reloading during development
  # host='0.0.0.0' makes it accessible on your local network
  app.run(debug=True, host='0.0.0.0')