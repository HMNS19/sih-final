from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import pandas as pd
from datetime import datetime, timedelta
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import requests

app = Flask(__name__)

# Google Maps API key
API_KEY = 'AIzaSyBSJi4beLUlh5IDO7jySN7sMkqFf2RSp9Y'

# Function to get distance from Google Maps API
def get_distance_matrix(origins, destinations):
    """Fetches the distance matrix from Google Maps API."""
    try:
        origins_str = '|'.join([f"{lat},{lon}" for lat, lon in origins])
        destinations_str = '|'.join([f"{lat},{lon}" for lat, lon in destinations])
        url = f"https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins={origins_str}&destinations={destinations_str}&key={API_KEY}"
        response = requests.get(url)
        matrix = response.json()
        
        if 'rows' not in matrix:
            print("Invalid response from Google Maps API")
            return []

        distances = []  
        for row in matrix['rows']:
            distances.append([element['distance']['value'] for element in row['elements']])
        return distances
    except Exception as e:
        print(f"Error fetching distance matrix: {e}")
        return []

# Solve the TSP Using Google OR-Tools
def solve_tsp(distance_matrix):
    """Solves the TSP for the given distance matrix."""
    try:
        tsp_size = len(distance_matrix)
        manager = pywrapcp.RoutingIndexManager(tsp_size, 1, 0)
        routing = pywrapcp.RoutingModel(manager)

        def distance_callback(from_index, to_index):
            """Returns the distance between the two nodes."""
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return distance_matrix[from_node][to_node]

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)

        solution = routing.SolveWithParameters(search_parameters)

        if solution:
            route = []
            index = routing.Start(0)
            while not routing.IsEnd(index):
                route.append(manager.IndexToNode(index))
                index = solution.Value(routing.NextVar(index))
            return route
        else:
            return None
    except Exception as e:
        print(f"Error solving TSP: {e}")
        return None

# Routes for optimization and calculation
@app.route('/optimized_route')
def optimize_route():
    return render_template('optimized_route.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    # Load the JSON file
    try:
        with open('garbage_pickup_data.json', 'r') as f:
            data = json.load(f)
    except Exception as e:
        return jsonify({"error": f"Error loading JSON file: {e}"}), 400

    # Extract locations and time ranges
    locations = [(entry['latitude'], entry['longitude']) for entry in data[:-1]]
    time_ranges = [(entry['start_time'], entry['end_time']) for entry in data[:-1]]

    # Extract the driver's location and start time
    driver_entry = data[-1]
    driver_location = (driver_entry['latitude'], driver_entry['longitude'])
    driver_start_time = driver_entry.get('start_time')

    # Generate full list of locations (driver + pickup points)
    all_locations = [driver_location] + locations

    # Fetch the distance matrix
    distance_matrix = get_distance_matrix(all_locations, all_locations)

    if not distance_matrix:
        return jsonify({"error": "No distance matrix returned. Check the Google Maps API response."}), 400

    # Solve for optimal route
    route = solve_tsp(distance_matrix)

    if not route:
        return jsonify({"error": "No optimal route found."}), 400

    # Suggest optimal start time if not provided
    if driver_start_time is None:
        earliest_start = min([datetime.strptime(start, '%H:%M') for start, _ in time_ranges])
        latest_end = max([datetime.strptime(end, '%H:%M') for _, end in time_ranges])
        driver_start_time = (earliest_start + (latest_end - earliest_start) / 2).strftime('%H:%M')

    # Prepare data for JSON response
    optimized_route_data = {
        "driver_start_time": driver_start_time,
        "optimized_route": []
    }

    # Add the step-by-step route to the JSON data
    for index in route:
        lat, lon = all_locations[index]
        maps_link = f"https://www.google.com/maps/search/?api=1&query={lat},{lon}"
        optimized_route_data["optimized_route"].append({
            "latitude": lat,
            "longitude": lon,
            "maps_link": maps_link
        })

    return jsonify(optimized_route_data)

# Basic site routes from app.py(2)
@app.route('/')
def index():
    return render_template('home.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/aboutus')
def aboutus():
    return render_template('aboutus.html')

@app.route('/dump')
def dump():
    return render_template('dump.html')

@app.route('/pickup')
def pickup():
    return render_template('pickup.html')

@app.route('/litter')
def litter():
    return render_template('litter.html')

@app.route('/add_bin')
def add_bin():
    return render_template('add_Bin.html')

@app.route('/viewbin')
def viewbin():
    return render_template('viewbin.html')

@app.route('/contactus')
def contactus():
    return render_template('contactus.html')

# Authentication routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Handle login logic here
        email = request.form.get('email')
        password = request.form.get('password')
        # Example logic, replace with actual authentication
        if email == 'test@example.com' and password == 'password':
            return redirect(url_for('home'))
        else:
            return render_template('login.html', message='Invalid credentials')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Handle registration logic here
        fName = request.form.get('fName')
        lName = request.form.get('lName')
        collegeName = request.form.get('collegeName')
        rEmail = request.form.get('rEmail')
        rPassword = request.form.get('rPassword')
        # Example logic, replace with actual registration
        return redirect(url_for('login'))
    return render_template('login.html')

if __name__ == '__main__':
    app.run(debug=True)
