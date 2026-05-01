import os
import json
import datetime
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(BASE_DIR, "app.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'super-secret-change-me')

CORS(app)
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    assessments = db.relationship('Assessment', backref='user', lazy=True)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Assessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    household = db.Column(db.Text, nullable=False)
    waste = db.Column(db.Text, nullable=False)
    habits = db.Column(db.Text, nullable=False)
    results = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

with app.app_context():
    db.create_all()

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def decode_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return User.query.get(payload.get('user_id'))
    except Exception:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        token = None
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1].strip()
        if not token:
            return jsonify({'message': 'Token is missing or invalid.'}), 401
        user = decode_token(token)
        if not user:
            return jsonify({'message': 'Token is invalid or expired.'}), 401
        return f(user, *args, **kwargs)
    return decorated

@app.route('/')
def home():
    return jsonify({'message': 'Waste Footprint Calculator API'})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    if not email or not password:
        return jsonify({'message': 'Email and password are required.'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'A user with that email already exists.'}), 409
    user = User(email=email, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    token = generate_token(user.id)
    return jsonify({'token': token, 'user': {'id': user.id, 'email': user.email}})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid email or password.'}), 401
    token = generate_token(user.id)
    return jsonify({'token': token, 'user': {'id': user.id, 'email': user.email}})

@app.route('/history', methods=['GET'])
@token_required
def history(user):
    entries = Assessment.query.filter_by(user_id=user.id).order_by(Assessment.created_at.desc()).limit(20).all()
    history_data = []
    for entry in entries:
        history_data.append({
            'id': entry.id,
            'household': json.loads(entry.household),
            'waste': json.loads(entry.waste),
            'habits': json.loads(entry.habits),
            'results': json.loads(entry.results),
            'created_at': entry.created_at.isoformat() + 'Z'
        })
    return jsonify({'history': history_data})

@app.route('/calculate', methods=['POST'])
def calculate_footprint():
    data = request.get_json() or {}
    household = data.get('household', {})
    waste = data.get('waste', {})
    habits = data.get('habits', {})
    people = household.get('people') or 1
    people = max(1, int(people)) if isinstance(people, (int, float, str)) else 1
    total_waste = sum((float(v) for v in waste.values() if v is not None))
    per_capita = total_waste / people
    average = 0.5
    waste_index = (per_capita / average) * 100
    weights = {
        'food': 1,
        'plastic': 5,
        'paper': 2,
        'glass': 3,
        'hazardous': 10
    }
    weighted_score = sum((float(waste.get(waste_type, 0)) or 0) * weight for waste_type, weight in weights.items())
    weighted_impact_score = weighted_score / people
    if weighted_impact_score < 2:
        classification = 'Excellent'
    elif weighted_impact_score < 5:
        classification = 'Good'
    elif weighted_impact_score < 10:
        classification = 'Moderate'
    elif weighted_impact_score < 20:
        classification = 'High'
    else:
        classification = 'Very High'
    strategies = []
    waste_categories = waste.copy()
    if waste_categories:
        highest_category = max(waste_categories, key=waste_categories.get)
        highest_amount = waste_categories[highest_category]
    else:
        highest_category = 'food'
        highest_amount = 0
    if highest_category == 'food' and highest_amount > 1:
        strategies.extend([
            'Reduce food waste by planning meals and creating shopping lists to buy only what you need.',
            'Store food properly to extend freshness and reduce spoilage.',
            'Use leftovers creatively in new meals or freeze them for later.',
            'Start composting food scraps to divert waste from landfills.'
        ])
    elif highest_category == 'plastic' and highest_amount > 0.5:
        strategies.extend([
            'Switch to reusable shopping bags, water bottles, and coffee cups.',
            'Choose products with minimal plastic packaging or buy in bulk.',
            'Avoid single-use plastics like straws, cutlery, and takeout containers.',
            'Recycle all plastic items that have recycling symbols 1-7.'
        ])
    elif highest_category == 'paper' and highest_amount > 0.3:
        strategies.extend([
            'Go digital whenever possible - use e-statements, e-tickets, and online documents.',
            'Use both sides of paper before recycling.',
            'Choose recycled paper products and support sustainable forestry.',
            'Reduce junk mail by opting out of unwanted catalogs and magazines.'
        ])
    elif highest_category == 'glass' and highest_amount > 0.2:
        strategies.extend([
            'Reuse glass jars and bottles for storage or crafts.',
            'Buy products in glass containers that can be returned or recycled.',
            'Clean glass before recycling to ensure proper processing.',
            'Support local bottle return programs if available.'
        ])
    elif highest_category == 'hazardous' and highest_amount > 0:
        strategies.extend([
            'Never pour hazardous waste down drains or in regular trash.',
            'Take hazardous materials to designated collection facilities.',
            'Use non-toxic alternatives for cleaning and pest control.',
            'Properly dispose of electronics, batteries, and paints separately.'
        ])
    for category, amount in waste_categories.items():
        if category != highest_category:
            if category == 'food' and amount > 1:
                strategies.append('Minimize food waste by checking expiration dates and using older items first.')
            elif category == 'plastic' and amount > 0.5:
                strategies.append('Choose products with less plastic packaging and opt for reusable alternatives.')
            elif category == 'paper' and amount > 0.3:
                strategies.append('Reduce paper usage by going digital and recycling properly.')
            elif category == 'glass' and amount > 0.2:
                strategies.append('Reuse glass containers and recycle broken glass.')
            elif category == 'hazardous' and amount > 0:
                strategies.append('Dispose of hazardous waste at proper collection sites.')
    if not habits.get('recycling', False):
        strategies.extend([
            'Start a comprehensive recycling program for paper, plastic, glass, and metal.',
            'Learn local recycling guidelines and sort materials properly.',
            'Set up designated recycling bins in your home for convenience.'
        ])
    else:
        strategies.append('Continue and expand your recycling habits to include more materials.')
    if not habits.get('composting', False):
        strategies.extend([
            'Begin composting food scraps and yard waste to reduce landfill contributions.',
            'Use a compost bin or pile in your yard, or join a community composting program.',
            'Learn what can and cannot be composted to maximize effectiveness.'
        ])
    else:
        strategies.append('Expand your composting to include more organic materials.')
    if per_capita > average * 1.5:
        strategies.extend([
            'Track your waste for a week to identify patterns and reduction opportunities.',
            'Adopt a zero waste mindset by refusing unnecessary packaging.',
            'Buy products with longer lifespans to reduce replacement frequency.',
            'Support companies that prioritize sustainable packaging.'
        ])
    elif per_capita > average:
        strategies.extend([
            'Review your consumption habits and identify areas for reduction.',
            'Choose products with minimal or recyclable packaging.',
            'Repair items instead of replacing them when possible.'
        ])
    else:
        strategies.extend([
            'Great job maintaining low waste levels - continue your sustainable practices!',
            'Share your waste reduction tips with friends and family.',
            'Consider mentoring others in waste reduction strategies.'
        ])
    if classification in ['High', 'Very High']:
        strategies.extend([
            'Calculate your carbon footprint and work on multiple reduction areas.',
            'Join local environmental groups or clean-up initiatives.',
            'Advocate for better waste management policies in your community.'
        ])
    elif classification == 'Moderate':
        strategies.append('Focus on your highest waste categories while maintaining good habits.')
    else:
        strategies.append('Maintain your excellent waste management practices.')
    seen = set()
    unique_strategies = []
    for strategy in strategies:
        if strategy not in seen:
            unique_strategies.append(strategy)
            seen.add(strategy)
    strategies = unique_strategies[:5]
    if len(strategies) < 3:
        strategies.extend([
            'Monitor your waste regularly and celebrate reduction achievements.',
            'Stay informed about local waste management and recycling options.',
            'Educate yourself on sustainable living practices.'
        ][:3-len(strategies)])
    response = {
        'total_waste': round(total_waste, 2),
        'per_capita': round(per_capita, 2),
        'waste_index': round(waste_index, 1),
        'weighted_impact_score': round(weighted_impact_score, 2),
        'classification': classification,
        'strategies': strategies,
        'waste_breakdown': {k: round(float(v), 2) for k, v in waste.items()},
        'habits': habits,
        'household': household
    }
    auth_header = request.headers.get('Authorization', '')
    token = None
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ', 1)[1].strip()
    user = decode_token(token) if token else None
    if user:
        assessment = Assessment(
            user_id=user.id,
            household=json.dumps(household),
            waste=json.dumps(waste),
            habits=json.dumps(habits),
            results=json.dumps(response)
        )
        db.session.add(assessment)
        db.session.commit()
    return jsonify(response)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
