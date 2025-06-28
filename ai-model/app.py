from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
model = joblib.load("donor_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    features = np.array([
        data["past_donations"],
        data["days_since_last_donation"],
        data["responded_last_time"]
    ]).reshape(1, -1)
    
    prediction = model.predict(features)[0]
    return jsonify({"prediction": int(prediction)})

if __name__ == "__main__":
    app.run(port=5001)
