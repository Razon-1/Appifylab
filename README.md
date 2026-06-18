# Buddy Script - Full Stack Social Network Application

A modern, professional full-stack social networking platform built with **React**, **Django REST Framework**, **Tailwind CSS**, and **SQLite**.

**🚀 Live Demo:** [Buddy Script on Vercel](https://appifylab-frontend.vercel.app)

## Project Demo

Watch the project demonstration: [YouTube Demo](https://youtu.be/TG-g53FY-wE)

## Clone from Git

```bash
git clone <repository-url>
cd Appifylab
```


Quick summary:
- **Frontend:** Deploy to Vercel (free)
- **Backend:** Deploy to Render (free)-working last date-17.6.26
- **Post images:** Use Cloudinary in production so uploaded images do not disappear after Render restarts.

## Production Image Uploads

Render's free filesystem is temporary, so uploaded post images should be stored outside the server.

1. Create a free Cloudinary account.
2. Copy the `CLOUDINARY_URL` value from your Cloudinary dashboard.
3. Add it to your Render backend environment variables:
```bash
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```
4. Redeploy the Render backend.

Newly uploaded images will then be served from Cloudinary.

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
