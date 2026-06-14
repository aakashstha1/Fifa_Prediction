# FIFA World Cup Winner Predictor 🏆

A fun, interactive web application where users can predict the winner of each match in the ongoing FIFA World Cup. Built to enjoy the tournament with cousins, brothers, and sisters!

## 🚀 Overview

This app was created in **4 days** through a mix of **vibe coding** and **self-coding**, using the **MERN stack** with **TanStack Query** for efficient data management. It's now live and ready for you to try out!

## ✨ Features

- **Match Predictions**: Predict the winner for every match in the FIFA World Cup
- **User-Friendly Interface**: Simple and intuitive design for easy navigation
- **Real-Time Updates**: Stay updated with the ongoing tournament matches
- **Fun & Competitive**: Perfect for competing with family members on predictions
- **Live Deployment**: Fully hosted and accessible online

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React (MERN) |
| **Backend** | Node.js + Express (MERN) |
| **Database** | MongoDB (MERN) |
| **Data Fetching** | TanStack Query (React Query) |
| **Frontend Hosting** | Netlify |
| **Backend Hosting** | Render |

## 📦 Project Structure

```
fifa-world-cup-predictor/
├── frontend/ # React application (Netlify)
│ ├── src/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── queries/ # TanStack Query setups
│ │ └── pages/
│ └── package.json
├── backend/ # Node.js + Express (Render)
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ └── server.js
├── package.json
├── README.md
└── .env
```

## 🎯 How It Works

1. **Browse Matches**: View all upcoming and ongoing FIFA World Cup matches
2. **Make Predictions**: Select your predicted winner for each match
3. **Track Results**: See how your predictions compare to actual results
4. **Compete**: Share with family and compete for the best prediction score

## 🌐 Live Deployment

- **Frontend**: Hosted on [Netlify](https://your-netlify-url.netlify.app)
- **Backend**: Hosted on [Render](https://your-render-url.render.com)

*Replace the URLs above with your actual deployment URLs*

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fifa-world-cup-predictor.git
   cd fifa-world-cup-predictor
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

   ```bash
   npm start
   ```

3. **Set up Frontend**
   ```bash
   cd frontend
   npm install
   ```
   
   Create a `.env` file:
   ```env
   REACT_APP_API_URL=your_backend_url
   ```

   ```bash
   npm start
   ```

## 🤝 Contributing

This is a fun personal project, but feel to fork it and customize it for your own tournament predictions!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request