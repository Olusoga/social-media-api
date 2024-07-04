import express from 'express';
import http from 'http';
import { config } from 'dotenv';
import { connectDB } from './config/db';

config();
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use(express.json());


const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
