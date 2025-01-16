# Melodia 🎵

Melodia is a Spotify-inspired music application featuring a custom music player and real-time functionalities. Experience seamless music streaming with an intuitive interface and dynamic features.

## Features 🚀

- **Custom Music Player**: Enjoy a personalized music experience with custom made player and queue system.
- **Real-Time Updates**: Message with Melodia users and see who is listening to what!
- **User-Friendly Interface**: Navigate effortlessly through the music library on all devices.
- **Seamless Management**: Authenticate yourself as an admin and effortlessly add, delete songs and albums via Admin Dashboard.

## Technologies Used 🧰

- **Frontend**: React.js, Tailwind CSS, Shadcn, Axios
- **State Management**: Zustand
- **Backend**: Node.js, Express.js, Socket.IO, Clerk
- **Database**: MongoDB, Cloudinary
- **Automation**: Cron (Automating Jobs)

## Demo 🌐

Check out the live version of Melodia: [melodia-aaln.onrender.com](https://melodia-aaln.onrender.com/)

## RENDER MIGHT SLOW DOWN INITIAL LAUNCH DUE TO INACTIVITY. PLEASE BE PATIENT WHILE WEBSITE LOADS.

## Installation 🛠️

To set up Melodia locally, follow these steps:

### Prerequisites

- Node.js (v22 or above)
- npm (v9 or above)

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ZTNimbus/melodia.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd melodia
   ```

3. **Install Dependencies**:

   - For the backend:

     ```bash
     cd backend
     npm install
     ```

   - For the frontend:

     ```bash
     cd ../frontend
     npm install
     ```

4. **Set Up Environment Variables**:

   Create a `.env` file in `backend` and `.env.local` in `frontend` directories with the following configurations:

   **Backend (**\*\*\***\*`backend/.env`**\*\*\*\*\*\*)\*\*:

   ```
    PORT
    MONGODB_URI
    ADMIN_EMAIL
    CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET
    CLOUDINARY_CLOUD_NAME
    CLERK_PUBLISHABLE_KEY
    CLERK_SECRET_KEY
    NODE_ENV
   ```

   **Frontend (**\*\*\***\*`frontend/.env.local`**\*\*\*\*\*\*)\*\*:

   ```
   VITE_CLERK_PUBLISHABLE_KEY
   ```

5. **Run the Application**:

   - Start the backend server:

     ```bash
     cd backend
     npm run dev
     ```

   - Start the frontend:

     ```bash
     cd ../frontend
     npm run dev
     ```

6. **Access the Application**:

   Open your browser and navigate to `http://localhost:YOURPORT`.
