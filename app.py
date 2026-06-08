import json
import os
from flask import Flask, render_template

app = Flask(__name__)

DATA_FILE = "budget_data.json"

def load_budget_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as file:
        return json.load(file)

@app.route("/")
def index():
    # Load data from the isolated json file
    items = load_budget_data()
    return render_template("index.html", budget_items=items)

# if __name__ == "__main__":
#     # Runs local server on http://127.0.0.1:5000
#     app.run(debug=True)

if __name__ == "__main__":
    # Binds to 0.0.0.0 and dynamically grabs the environment port
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
