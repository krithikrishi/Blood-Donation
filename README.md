# 🩸 Blood Donation Platform

A full-stack web application designed to connect blood donors with recipients. This platform enables users to register, find nearby hospitals, and request or donate blood. It also integrates AI-based prediction, chatbot assistance, and Google Maps for real-time location services.

---

## 🚀 Features

- User registration and login with JWT-based authentication  
- Search and list nearby hospitals using Google Maps API  
- Distance and estimated travel time display  
- Blood request and donor functionality  
- AI chatbot assistant powered via OpenRouter API  
- MongoDB for data persistence  
- Python-powered AI logic (optional, located in `ai-model/`)  
- Clean and responsive UI with TailwindCSS and Vite  
- Designed as a scalable prototype — future features like donor matching, alerts, and analytics can be integrated via backend pipelines  

---

## 🛠 Tech Stack

### Frontend
- React  
- Tailwind CSS  
- Vite  

### Backend
- Node.js  
- Express.js  
- MongoDB  
- JWT for authentication  
- Google Maps JavaScript & Places API  
- OpenRouter API (AI assistant)  

### AI / Machine Learning
- Python scripts inside `ai-model/`

---

## 📦 Getting Started

### ✅ Prerequisites
- Node.js (v16+ recommended)  
- npm  
- Python 3.x (if using AI features)  
- MongoDB Atlas or local instance  

### 🧾 Clone the Repository
```bash
git clone https://github.com/krithikrishi/blood-donation.git
cd blood-donation
```
### 🔐 Create a .env File in the Root Directory
```bash
MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret_key  
GOOGLE_MAPS_API_KEY=your_google_maps_api_key  
OPENROUTER_API_KEY=your_openrouter_api_key  
PORT=5000
```

### 📦 Installation
```bash
Backend Dependencies:
cd backend
npm install
```

### Frontend Dependencies:
```bash
cd ../
npm install
```

### 🚀 Running the Project
```bash
Start Backend Server:
cd backend
npm run dev
```

### Start Frontend (in a separate terminal):
```bash
cd ../
npm run dev
```

### Run the AI Model (optional, separate terminal):
cd ai-model
python app.py
```
📝 License
This project is for educational/demo purposes.
Feel free to use and extend it as needed.



