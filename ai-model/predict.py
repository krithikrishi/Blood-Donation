import sys
import joblib
import json
import pandas as pd  # ✅ Add this

# Load model
model = joblib.load('donor_model.pkl')

# Read input data from stdin
input_data = json.loads(sys.stdin.read())

# ✅ Prepare DataFrame with column names
X = pd.DataFrame([{
    'past_donations': input_data['past_donations'],
    'days_since_last_donation': input_data['days_since_last_donation'],
    'responded_last_time': input_data['responded_last_time']
}])

# Make prediction
prediction = model.predict(X)[0]

# Output the result
print(json.dumps({'available': int(prediction)}))
