# Waste Footprint Calculator

A modern, eco-friendly web application for calculating and analyzing personal waste footprints with personalized reduction strategies.

## Features

- **Interactive Assessment**: 3-step form collecting household, waste, and habit data
- **Real-time Calculations**: Backend API providing waste analysis and environmental impact scoring
- **Personalized Strategies**: AI-generated reduction recommendations based on your waste profile
- **Beautiful UI**: Glassmorphism design with circular cards and nature-inspired aesthetics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18.2.0
- Tailwind CSS 3.3.2
- Chart.js for data visualization
- Axios for API communication

### Backend
- Flask 3.1.3
- Flask-CORS for cross-origin requests
- Python 3.12

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.12
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nave-crypto/Waste-Footprint-Calculator.git
   cd waste-footprint-calculator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # On Windows
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

- `GET /` - API health check
- `POST /calculate` - Calculate waste footprint

### Calculate Endpoint

**Request Body:**
```json
{
  "household": {
    "people": 4,
    "location": "urban"
  },
  "waste": {
    "food": 2.5,
    "plastic": 0.8,
    "paper": 1.2,
    "glass": 0.5,
    "hazardous": 0.1
  },
  "habits": {
    "recycling": true,
    "composting": false
  }
}
```

**Response:**
```json
{
  "total_waste": 5.1,
  "per_capita": 1.275,
  "waste_index": 255.0,
  "weighted_impact_score": 6.25,
  "classification": "Moderate",
  "strategies": ["Strategy 1", "Strategy 2", ...],
  "waste_breakdown": {"food": 2.5, "plastic": 0.8, ...}
}
```

## Project Structure

```
waste-footprint-calculator/
├── backend/
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Virtual environment
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── index.css       # Global styles
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern web technologies for environmental awareness
- Inspired by sustainable living and waste reduction initiatives