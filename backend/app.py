from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import psycopg2
from psycopg2 import sql


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# PostgreSQL database connection configuration
DATABASE_CONFIG = {
    'dbname': 'nutrition_db',
    'user': 'nutrition_user',
    'password': 'Mateo2509',
    'host': 'localhost'
}

# Connect to the PostgreSQL database
def get_db_connection():
    conn = psycopg2.connect(**DATABASE_CONFIG)
    return conn

def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS public.user (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS public.personal_data (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) REFERENCES public.user(username) ON DELETE CASCADE,
        height DECIMAL(5, 2),
        weight DECIMAL(5, 2),
        age INT,
        activity_level INT
    );
    """)
    conn.commit()
    cursor.close()
    conn.close()

create_tables()




# Root route
@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Nutrition App!"})




# Signup route (POST)
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO public.user (username, email, password) VALUES (%s, %s, %s)",
            (data['username'], data['email'], hashed_password)
        )
        conn.commit()
        return jsonify({"message": "User created successfully!"}), 201
    except psycopg2.IntegrityError as e:
        conn.rollback()
        return jsonify({"message": "Error: User creation failed.", "error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

    



# Login route (POST)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT username, password FROM public.user WHERE email = %s",
        (data['email'],)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if user and check_password_hash(user[1], data['password']):
        return jsonify({"message": "Login successful!", "username": user[0]}), 200
    else:
        return jsonify({"message": "Invalid credentials!"}), 401
    


# Save personal data route (POST)
@app.route('/save_personal_data', methods=['POST'])
def save_personal_data():
    try:
        data = request.json
        username = data.get('username')
        height = data.get('height')
        weight = data.get('weight')
        age = data.get('age')
        activity_level = data.get('activity_level')

        if not username or height is None or weight is None or age is None or activity_level is None:
            return jsonify({"message": "All fields are required!"}), 400

        # Connect to the database
        conn = psycopg2.connect(
            dbname="nutrition_db",
            user="nutrition_user",
            password="Mateo2509",
            host="localhost"
        )
        cursor = conn.cursor()

        # Check if personal data already exists for the username
        cursor.execute(
            "SELECT * FROM personal_data WHERE username = %s", (username,)
        )
        existing_data = cursor.fetchone()

        if existing_data:
            # Update the existing record
            cursor.execute(
                """
                UPDATE personal_data 
                SET height = %s, weight = %s, age = %s, activity_level = %s
                WHERE username = %s
                """,
                (height, weight, age, activity_level, username)
            )
            message = "Personal data updated successfully!"
        else:
            # Insert a new record
            cursor.execute(
                """
                INSERT INTO personal_data (username, height, weight, age, activity_level) 
                VALUES (%s, %s, %s, %s, %s)
                """,
                (username, height, weight, age, activity_level)
            )
            message = "Personal data saved successfully!"

        # Commit the transaction
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": message}), 201

    except Exception as e:
        print(f"Error saving personal data: {e}")  # Log error to server console
        return jsonify({"message": "Error saving data", "error": str(e)}), 500


# Fetch personal data for the current user
@app.route('/get_personal_data', methods=['GET'])
def get_personal_data():
    username = request.args.get('username')
    if not username:
        return jsonify({"message": "Username is required!"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT height, weight, age, activity_level FROM personal_data WHERE username = %s", (username,))
        data = cursor.fetchone()
        cursor.close()
        conn.close()

        if data:
            # Return personal data as JSON
            return jsonify({
                "height": data[0],
                "weight": data[1],
                "age": data[2],
                "activity_level": data[3]
            }), 200
        else:
            return jsonify({"message": "No personal data found for this user."}), 404
    except Exception as e:
        print(f"Error fetching personal data: {e}")
        return jsonify({"message": "Error fetching data", "error": str(e)}), 500


# Make sure to have this setup for the app to run
if __name__ == '__main__':
    app.run(debug=True)



if __name__ == '__main__':
    app.run(debug=True)
