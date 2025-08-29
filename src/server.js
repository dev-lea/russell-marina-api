import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import catwayRoutes from './routes/catway.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import { notFound, errorHandler } from './middleware/error.js';
import { swaggerSpec } from './docs/swagger.js';
import { User } from './models/User.js';
import { requireAuth } from './middleware/auth.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN }));
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

// Fichiers statiques (sert /)
app.use(express.static('public'));

// (Optionnel) endpoint de test
app.get('/api/ping', (_req, res) => res.json({ ok: true }));

// ✅ Routes PUBLIQUES
app.use('/api', authRoutes); // contient POST /login

// 🔒 Routes PROTÉGÉES (token requis)
app.use('/api', requireAuth, userRoutes);
app.use('/api', requireAuth, catwayRoutes);
app.use('/api', requireAuth, reservationRoutes);

// Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 + handler d'erreurs
app.use('/api/*', notFound);
app.use(errorHandler);

async function start() {
  await connectDB();

  // seed admin si absent
  const admin = await User.findOne({ email: env.ADMIN_EMAIL });
  if (!admin) {
    await User.create({
      username: env.ADMIN_USERNAME,
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
    });
    console.log('✔ Admin user created:', env.ADMIN_EMAIL);
  }

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

start();

