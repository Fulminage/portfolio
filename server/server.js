import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js'; // must be first: loads + validates .env
import connectDB from './config/db.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();

// Render sits behind a proxy; this makes rate limiting see the visitor's real IP.
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = Postman, curl, server-to-server. Browsers always send one.
      if (!origin || env.clientOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json({ limit: '10kb' }));
app.use('/api', apiLimiter);

// Health check (handy for Render and for quick testing)
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', profileRoutes);

app.use(notFound);
app.use(errorHandler);

await connectDB();
app.listen(env.port, () => {
  console.log(`Server running on port ${env.port} (${env.isProduction ? 'production' : 'development'})`);
});
