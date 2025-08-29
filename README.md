Smart Timetable Scheduler 🎓
An intelligent web-based application designed to automate and optimize the creation of academic timetables for educational institutions. This project leverages a constraint satisfaction algorithm to generate clash-free schedules, maximizing resource utilization and balancing faculty workloads.

📜 About The Project
In most colleges and universities, timetable creation is a manual, tedious, and error-prone process. Schedulers must juggle countless constraints, including faculty availability, classroom capacity, student batch sizes, and lab requirements. This often results in scheduling conflicts, underutilized rooms, and dissatisfaction among students and staff.

The Smart Timetable Scheduler tackles this complex problem head-on. By defining the scheduling puzzle as a set of logical constraints, the application's backend can systematically find a valid, conflict-free solution in a fraction of the time it would take a human. This prototype serves as a proof-of-concept for a more robust system capable of revolutionizing academic administration.

✨ Key Features
Automated Generation: Creates a complete, valid timetable with a single click.

Clash-Free Guarantee: Ensures a faculty member, a student batch, or a room is not scheduled for more than one class at the same time.

Constraint-Driven Logic: Built on a powerful constraint solver that strictly adheres to predefined rules.

Simple Web Interface: An intuitive UI for inputting parameters (subjects, rooms, faculty) and viewing the final schedule.

Decoupled Architecture: A clean separation between the Flask backend (logic) and the vanilla JS/HTML frontend (presentation).

🛠️ Technology Stack
This project is built with a focus on simplicity and effectiveness.

Backend:

Python 3.8+

Flask: A lightweight micro web framework for the API.

python-constraint: A simple but powerful library for solving constraint satisfaction problems.

Frontend:

HTML5: For the core structure of the web page.

CSS3: For styling and layout.

JavaScript (ES6+): For DOM manipulation and API communication (fetch).

🗂️ Project Structure
The repository is organized with a clear separation between the server and the client:

/
├── backend/
│   ├── app.py              # Main Flask application (API endpoints)
│   ├── solver.py           # Core scheduling logic
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── index.html          # The main HTML file
│   ├── css/style.css       # Stylesheet
│   └── js/main.js          # Client-side JavaScript
│
├── .gitignore              # Files to be ignored by Git
└── README.md               # This file

🚀 Getting Started
Follow these instructions to set up and run a local copy of the project.

Prerequisites
Python 3.8 or newer

pip (Python package installer)

Git for version control

Installation & Setup
Clone the GitHub repository:

git clone https://github.com/ManuStu-web/Smart_Scheduler
cd smart-scheduler-prototype

Set up the Python backend:

# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install the required packages
pip install -r requirements.txt

Run the backend server:

# Make sure you are in the 'backend' directory with the venv active
flask run

The server will start, typically on http://127.0.0.1:5000. Keep this terminal running.

Launch the frontend:

Navigate to the frontend folder in your file explorer.

Open the index.html file in your preferred web browser (e.g., Chrome, Firefox).

For the best experience, use a live server extension (like "Live Server" in VS Code) to automatically reload the page on changes.

💡 Usage
Once the application is running:

Input your data into the provided text areas on the webpage (e.g., subjects, faculty members, and available rooms).

Click the "Generate Timetable" button.

The frontend will send this data to the Flask backend.

The backend solver will process the constraints and find a valid schedule.

The resulting timetable will be displayed neatly in the grid on the webpage.

🗺️ Roadmap
This prototype is the starting point. Future goals include:

[ ] Database Integration: Use a database like PostgreSQL or SQLite to store data persistently.

[ ] User Authentication: Add login/logout functionality and role-based access for administrators.

[ ] Soft Constraints: Implement optimizations based on preferences (e.g., minimizing gaps for students, preferred teaching hours for faculty).

[ ] Advanced UI: Improve the user interface with a more dynamic and interactive grid.

[ ] Export Functionality: Allow users to export the final timetable to PDF or CSV formats.

📄 License
This project is distributed under the MIT License. See the LICENSE file for more information.
