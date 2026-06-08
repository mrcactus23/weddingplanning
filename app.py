import json
import os
import time
from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)
DATA_FILE = "budget_data.json"

def load_budget_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as file:
        try:
            return json.load(file)
        except json.JSONDecodeError:
            return []

def save_budget_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=2)

@app.route("/")
def index():
    items = load_budget_data()
    return render_template("index.html", budget_items=items)

@app.route("/add_item", methods=["POST"])
def add_item():
    items = load_budget_data()
    unique_id = f"item_{int(time.time())}"
    new_item = {
        "id": unique_id,
        "category": request.form.get("category"),
        "name": request.form.get("name"),
        "est": float(request.form.get("est") or 0),
        "note": request.form.get("note") or ""
    }
    items.append(new_item)
    save_budget_data(items)
    return redirect(url_for("index"))

@app.route("/delete_item/<item_id>", methods=["POST"])
def delete_item(item_id):
    items = load_budget_data()
    updated_items = [item for item in items if item["id"] != item_id]
    save_budget_data(updated_items)
    return redirect(url_for("index"))

# NEW ROUTE: Handles live server updates when changing an Estimate amount
@app.route("/update_est", methods=["POST"])
def update_est():
    data = request.get_json()
    item_id = data.get("id")
    new_val = float(data.get("est") or 0)
    
    items = load_budget_data()
    for item in items:
        if item["id"] == item_id:
            item["est"] = new_val
            break
            
    save_budget_data(items)
    return jsonify({"status": "success"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
