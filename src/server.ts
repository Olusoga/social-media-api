import express from 'express';
import http from 'http';
import { config } from 'dotenv';
import { connectDB } from './config/db';
import userRoutes from './routes/user.route';
import postRoutes from './routes/post.route'
import { errorHandler } from './middlewares/errorhandlerMiddleware';

config();
const app = express();
const server = http.createServer(app);
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes)

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.use(express.json());


const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
