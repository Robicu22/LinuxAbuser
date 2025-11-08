import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production and development
const allowedOrigins = [
  'http://localhost:5173', // Local development
  process.env.FRONTEND_URL, // Production frontend URL from Vercel
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(bodyParser.json());

// Health check endpoint for monitoring
app.get('/', (req, res) => {
  res.json({ 
    message: 'LinuxAbuser Task Management API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use("/api", userRoutes);
app.use("/api", taskRoutes);
app.use("/api", workspaceRoutes);
app.use("/api", notificationRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
