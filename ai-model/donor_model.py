import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Mock data (in real life, you'd fetch from the database)
data = pd.DataFrame({
    'past_donations': [2, 4, 0, 1, 5, 3, 0, 2, 1, 6],
    'days_since_last_donation': [30, 90, 400, 200, 60, 100, 500, 150, 250, 45],
    'responded_last_time': [1, 1, 0, 0, 1, 1, 0, 0, 0, 1],
    'available': [1, 1, 0, 0, 1, 1, 0, 0, 0, 1]  # Target
})

# Features and label
X = data[['past_donations', 'days_since_last_donation', 'responded_last_time']]
y = data['available']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# Save the model
joblib.dump(model, 'donor_model.pkl')
print("✅ Model saved as donor_model.pkl")
