import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json());

app.use("/api", userRoutes);
app.use("/api", taskRoutes);
app.use("/api", workspaceRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
