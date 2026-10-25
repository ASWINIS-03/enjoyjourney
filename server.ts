import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { initDatabase } from './server/db.js';
import authRoutes from './server/routes/authRoutes.js';
import serviceRoutes from './server/routes/serviceRoutes.js';
import bookingRoutes from './server/routes/bookingRoutes.js';
import offerRoutes from './server/routes/offerRoutes.js';
import notificationRoutes from './server/routes/notificationRoutes.js';
import supportRoutes from './server/routes/supportRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Initialize DB & Seed Data
  await initDatabase();

  // Mount REST API endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/offers', offerRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/support', supportRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'EnjoyJourney Travel Booking API',
      timestamp: new Date().toISOString(),
    });
  });

  // Frontend Serving: Vite dev server middleware or static dist
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EnjoyJourney] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[EnjoyJourney] Fatal startup error:', err);
  process.exit(1);
});
