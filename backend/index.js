import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


app.use(bodyParser.json());

app.use("/api",userRoutes);

connectDB();
