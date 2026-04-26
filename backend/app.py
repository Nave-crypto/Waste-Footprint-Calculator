import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return jsonify({"message": "Waste Footprint Calculator API"})

@app.route('/calculate', methods=['POST'])
def calculate_footprint():
    data = request.get_json()
    household = data.get('household', {})
    waste = data.get('waste', {})
    habits = data.get('habits', {})

    # Calculate total waste
    total_waste = sum(waste.values())

    # Calculate per capita waste
    people = household.get('people', 1)
    per_capita = total_waste / people

    # Calculate waste index (compared to Indian average 0.5 kg/person/day)
    average = 0.5
    waste_index = (per_capita / average) * 100

    # Calculate weighted impact score
    # Weights based on environmental impact
    weights = {
        'food': 1,      # Biodegradable, low impact
        'plastic': 5,   # Persistent, high impact
        'paper': 2,     # Recyclable, moderate impact
        'glass': 3,     # Recyclable but energy-intensive, moderate-high
        'hazardous': 10  # Toxic, very high impact
    }

    weighted_score = sum(waste.get(waste_type, 0) * weight for waste_type, weight in weights.items())
    weighted_impact_score = weighted_score / people  # Per capita weighted score

    # Classification based on weighted impact score
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

    # Generate reduction strategies based on rules
    strategies = []

    # Find highest waste category
    waste_categories = waste.copy()
    highest_category = max(waste_categories, key=waste_categories.get)
    highest_amount = waste_categories[highest_category]

    # Rule-based strategies for highest waste category
    if highest_category == 'food' and highest_amount > 1:
        strategies.extend([
            "Reduce food waste by planning meals and creating shopping lists to buy only what you need.",
            "Store food properly to extend freshness and reduce spoilage.",
            "Use leftovers creatively in new meals or freeze them for later.",
            "Start composting food scraps to divert waste from landfills."
        ])
    elif highest_category == 'plastic' and highest_amount > 0.5:
        strategies.extend([
            "Switch to reusable shopping bags, water bottles, and coffee cups.",
            "Choose products with minimal plastic packaging or buy in bulk.",
            "Avoid single-use plastics like straws, cutlery, and takeout containers.",
            "Recycle all plastic items that have recycling symbols 1-7."
        ])
    elif highest_category == 'paper' and highest_amount > 0.3:
        strategies.extend([
            "Go digital whenever possible - use e-statements, e-tickets, and online documents.",
            "Use both sides of paper before recycling.",
            "Choose recycled paper products and support sustainable forestry.",
            "Reduce junk mail by opting out of unwanted catalogs and magazines."
        ])
    elif highest_category == 'glass' and highest_amount > 0.2:
        strategies.extend([
            "Reuse glass jars and bottles for storage or crafts.",
            "Buy products in glass containers that can be returned or recycled.",
            "Clean glass before recycling to ensure proper processing.",
            "Support local bottle return programs if available."
        ])
    elif highest_category == 'hazardous' and highest_amount > 0:
        strategies.extend([
            "Never pour hazardous waste down drains or in regular trash.",
            "Take hazardous materials to designated collection facilities.",
            "Use non-toxic alternatives for cleaning and pest control.",
            "Properly dispose of electronics, batteries, and paints separately."
        ])

    # Additional strategies based on waste amounts (secondary categories)
    for category, amount in waste_categories.items():
        if category != highest_category:  # Already handled above
            if category == 'food' and amount > 1:
                strategies.append("Minimize food waste by checking expiration dates and using older items first.")
            elif category == 'plastic' and amount > 0.5:
                strategies.append("Choose products with less plastic packaging and opt for reusable alternatives.")
            elif category == 'paper' and amount > 0.3:
                strategies.append("Reduce paper usage by going digital and recycling properly.")
            elif category == 'glass' and amount > 0.2:
                strategies.append("Reuse glass containers and recycle broken glass.")
            elif category == 'hazardous' and amount > 0:
                strategies.append("Dispose of hazardous waste at proper collection sites.")

    # Habit-based strategies
    if not habits.get('recycling', False):
        strategies.extend([
            "Start a comprehensive recycling program for paper, plastic, glass, and metal.",
            "Learn local recycling guidelines and sort materials properly.",
            "Set up designated recycling bins in your home for convenience."
        ])
    else:
        strategies.append("Continue and expand your recycling habits to include more materials.")

    if not habits.get('composting', False):
        strategies.extend([
            "Begin composting food scraps and yard waste to reduce landfill contributions.",
            "Use a compost bin or pile in your yard, or join a community composting program.",
            "Learn what can and cannot be composted to maximize effectiveness."
        ])
    else:
        strategies.append("Expand your composting to include more organic materials.")

    # Overall waste level strategies
    if per_capita > average * 1.5:
        strategies.extend([
            "Track your waste for a week to identify patterns and reduction opportunities.",
            "Adopt a 'zero waste' mindset by refusing unnecessary packaging.",
            "Buy products with longer lifespans to reduce replacement frequency.",
            "Support companies that prioritize sustainable packaging."
        ])
    elif per_capita > average:
        strategies.extend([
            "Review your consumption habits and identify areas for reduction.",
            "Choose products with minimal or recyclable packaging.",
            "Repair items instead of replacing them when possible."
        ])
    else:
        strategies.extend([
            "Great job maintaining low waste levels - continue your sustainable practices!",
            "Share your waste reduction tips with friends and family.",
            "Consider mentoring others in waste reduction strategies."
        ])

    # Environmental impact strategies based on classification
    if classification in ['High', 'Very High']:
        strategies.extend([
            "Calculate your carbon footprint and work on multiple reduction areas.",
            "Join local environmental groups or clean-up initiatives.",
            "Advocate for better waste management policies in your community."
        ])
    elif classification == 'Moderate':
        strategies.append("Focus on your highest waste categories while maintaining good habits.")
    else:
        strategies.append("Maintain your excellent waste management practices.")

    # Remove duplicates and limit to top 5 strategies
    seen = set()
    unique_strategies = []
    for strategy in strategies:
        if strategy not in seen:
            unique_strategies.append(strategy)
            seen.add(strategy)

    strategies = unique_strategies[:5]

    # Ensure at least 3 strategies
    if len(strategies) < 3:
        strategies.extend([
            "Monitor your waste regularly and celebrate reduction achievements.",
            "Stay informed about local waste management and recycling options.",
            "Educate yourself on sustainable living practices."
        ][:3-len(strategies)])

    return jsonify({
        "total_waste": round(total_waste, 2),
        "per_capita": round(per_capita, 2),
        "waste_index": round(waste_index, 1),
        "weighted_impact_score": round(weighted_impact_score, 2),
        "classification": classification,
        "strategies": strategies,
        "waste_breakdown": {k: round(v, 2) for k, v in waste.items()},
        "habits": habits,
        "household": household
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)