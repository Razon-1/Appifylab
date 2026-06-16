# Buddy Script - Full Stack Social Network Application

A modern, professional full-stack social networking platform built with **React**, **Django REST Framework**, **Tailwind CSS**, and **MySQL**.

## Clone from Git

```bash
git clone <repository-url>
cd Appifylab
```

## Running the Backend

1. Navigate to the backend directory:
```bash
cd buddy-backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
.\venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

The backend will run on `http://localhost:8000`

## Running the Frontend

1. Navigate to the frontend directory:
```bash
cd buddy-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`
