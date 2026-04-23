from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the trained model
MODEL_PATH = 'crop_app.pkl'
if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, 'rb') as file:
        model = pickle.load(file)
    print(f"Model loaded correctly from {MODEL_PATH}")
else:
    model = None
    print(f"Warning: {MODEL_PATH} not found. Please run train_model.py first.")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analysis')
def analysis():
    return render_template('analysis.html')

@app.route('/market')
def market():
    return render_template('market.html')

@app.route('/forecast')
def forecast():
    return render_template('forecast.html')

def estimate_soil_params(lat, lng):
    # South Asia (India, Bangladesh, Pakistan, Sri Lanka)
    if 8 <= lat <= 37 and 68 <= lng <= 97:
        if lat < 15:  # South India — laterite soils
            return {"N": 65, "P": 28, "K": 42, "ph": 5.8, "zone": "South India — Laterite Soil"}
        elif lat < 23:  # Central India — black cotton soil
            return {"N": 82, "P": 35, "K": 58, "ph": 7.2, "zone": "Central India — Black Cotton Soil"}
        else:  # North India — alluvial soil (Punjab, UP, Bihar)
            return {"N": 95, "P": 48, "K": 72, "ph": 7.8, "zone": "North India — Alluvial Soil"}
    
    # Southeast Asia
    elif -10 <= lat <= 25 and 95 <= lng <= 140:
        return {"N": 78, "P": 38, "K": 55, "ph": 5.5, "zone": "Southeast Asia — Tropical Soil"}
    
    # Sub-Saharan Africa
    elif -35 <= lat <= 15 and -20 <= lng <= 55:
        return {"N": 45, "P": 18, "K": 30, "ph": 6.1, "zone": "Sub-Saharan Africa — Arid Soil"}
    
    # Latin America (Amazon/tropical)
    elif -25 <= lat <= 10 and -80 <= lng <= -35:
        return {"N": 55, "P": 22, "K": 38, "ph": 5.2, "zone": "Latin America — Tropical Soil"}
    
    # Europe / North America (temperate)
    elif 35 <= lat <= 70 and -130 <= lng <= 40:
        return {"N": 88, "P": 52, "K": 68, "ph": 6.5, "zone": "Temperate Zone — Fertile Soil"}
    
    # Default (global average)
    else:
        return {"N": 70, "P": 35, "K": 50, "ph": 6.5, "zone": "Global Average — Mixed Soil"}

@app.route('/get_soil_data', methods=['POST'])
def get_soil_data():
    try:
        data = request.get_json()
        lat = float(data['lat'])
        lng = float(data['lng'])
        result = estimate_soil_params(lat, lng)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        data = request.get_json()
        features = [
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]
        
        input_data = np.array([features])
        
        # Get Rank-wise prediction probabilities
        probs = model.predict_proba(input_data)[0]
        classes = model.classes_
        
        # Create a detailed result list
        results = []
        for i in range(len(classes)):
            crop = classes[i]
            prob = float(probs[i] * 100)
            
            # Categorization logic
            category = "Other"
            if crop in ['rice', 'maize', 'wheat']:
                category = "Grains"
            elif crop in ['chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 'mungbean', 'blackgram', 'lentil']:
                category = "Vegetables/Pulses"
            elif crop in ['pomegranate', 'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 'apple', 'orange', 'papaya', 'coconut']:
                category = "Fruits"
            elif crop in ['cotton', 'jute', 'coffee']:
                category = "Commercial"
                
            # Smart Market Price Estimation (Mock trend for 2026)
            price_ranges = {
                "rice": "₹2,500 - ₹3,200/quintal",
                "maize": "₹1,800 - ₹2,200/quintal",
                "chickpea": "₹4,800 - ₹5,500/quintal",
                "cotton": "₹6,000 - ₹8,500/quintal",
                "coffee": "₹18,000 - ₹22,000/quintal",
                "banana": "₹15 - ₹35/kg",
                "apple": "₹80 - ₹150/kg",
                "mango": "₹60 - ₹120/kg",
                "orange": "₹40 - ₹80/kg"
            }
            price = price_ranges.get(crop, "₹50 - ₹150/kg") # Default estimate
            
            results.append({
                "crop": crop,
                "confidence": round(prob, 2),
                "category": category,
                "price": price
            })
            
        # Sort results by confidence
        sorted_results = sorted(results, key=lambda x: x['confidence'], reverse=True)
        
        return jsonify({
            "recommendations": sorted_results[:6], # Return top 6 for the dashboard
            "best_crop": sorted_results[0]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Running on port 5001 because 5000 is common on macOS
    app.run(host='0.0.0.0', port=5001, debug=True)
