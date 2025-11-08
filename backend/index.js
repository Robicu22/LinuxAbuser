import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

// Load environment variables first
dotenv.config();

const app = express();

// Allow requests from web and mobile apps
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from Vite dev server, Capacitor, and no origin (mobile apps)
      const allowedOrigins = [
        'http://localhost:5173',
        'http://192.168.1.100:5173', // Your network IP for testing
        'capacitor://localhost',
        'ionic://localhost',
        'http://localhost'
      ];
      
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins in dev (change for production!)
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(bodyParser.json());

// Register API routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

