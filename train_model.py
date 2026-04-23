import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle

# 1. Load the dataset
print("Loading dataset...")
try:
    df = pd.read_csv('Crop_recommendation.csv')
    print("Dataset loaded successfully.")
except FileNotFoundError:
    print("Error: Crop_recommendation.csv not found. Please ensure the file is in the current directory.")
    exit()

# 2. Define Features (X) and Target (y)
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

# 3. Split the data into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Initialize and train the RandomForestClassifier
print("Training the Random Forest model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy on Test Set: {accuracy * 100:.2f}%")

# 6. Save the trained model as crop_app.pkl
model_filename = 'crop_app.pkl'
with open(model_filename, 'wb') as file:
    pickle.dump(model, file)
print(f"Model saved as {model_filename}")

# 7. Sample Prediction to verify
print("\nVerifying with a sample prediction...")
sample_input = np.array([[90, 42, 43, 20.8, 82.0, 6.5, 202.9]]) # Realistic sample for 'rice'
prediction = model.predict(sample_input)
probabilities = model.predict_proba(sample_input)
confidence = np.max(probabilities) * 100

print(f"Input: {sample_input[0]}")
print(f"Recommended Crop: {prediction[0]}")
print(f"Confidence: {confidence:.2f}%")
