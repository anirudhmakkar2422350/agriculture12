# Smart Agriculture Crop Recommendation System

An AI-powered web application that recommends the most suitable crop for a field based on soil and climate parameters.

## ✨ Features
- **Machine Learning**: RandomForestClassifier trained on real agricultural data.
- **REST API**: Flask backend handles predictions with high accuracy.
- **Modern UI**: Interactive dashboard with real-time value updates and responsive design.
- **Data Insights**: Visual confidence indicators and crop-specific environmental insights.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6)
- **Backend**: Python, Flask, Flask-CORS
- **AI/ML**: Scikit-Learn, Pandas, NumPy, Pickle

## 🚀 How to Run

### 1. Install Dependencies
Ensure you have Python 3 installed. Run:
```bash
pip install -r requirements.txt
```

### 2. Train the Model
This will process the dataset and save the trained model as `crop_app.pkl`.
```bash
python3 train_model.py
```

### 3. Start the Flask Server
```bash
python3 app.py
```

### 4. Open the App
Visit [http://localhost:5000](http://localhost:5000) in your web browser.

## 📁 File Structure
- `app.py`: Main Flask application and REST API.
- `train_model.py`: Script to train and save the ML model.
- `Crop_recommendation.csv`: Dataset for training.
- `crop_app.pkl`: Serialized model file (auto-generated).
- `templates/`: HTML templates (index.html).
- `static/`: CSS and JS assets.
- `requirements.txt`: Python package list.

## 📊 Parameters
- **N, P, K**: Nitrogen, Phosphorus, and Potassium levels in the soil.
- **Temperature**: Surface temperature in Celsius.
- **Humidity**: Relative humidity in percentage.
- **Soil pH**: Acidity or alkalinity of the soil.
- **Rainfall**: Annual average rainfall in mm.
