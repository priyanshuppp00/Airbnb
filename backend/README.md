# Airbnb Clone Backend

This is the backend server for the Airbnb clone project.

## Technologies Used

- Node.js
- Express
- MongoDB with Mongoose
- Session-based authentication
- File uploads with Multer

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file in the root of the backend directory with the following variables:

   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   ```

3. Start the development server:
   ```
   npm start
   ```

## Deployment

- Use `node app.js` to start the server in production.
- Configure environment variables on your hosting platform.
- Ensure CORS is configured to allow your frontend URL.

## API Endpoints

- `/api/store` - Store related routes
- `/api/host` - Host related routes
- `/api/auth` - Authentication routes

## Notes

- Static files are served from `/public` and `/uploads`.
- Session cookies are configured for 1 day expiration.
