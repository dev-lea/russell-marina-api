// src/routes/auth.routes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

const router = express.Router();

/**
 * Authentifie un utilisateur et renvoie un JWT.
 * @route POST /login
 * @param {string} req.body.email - Adresse e-mail
 * @param {string} req.body.password - Mot de passe
 * @returns {200 {token:string,user:{email:string,username:string}}} OK
 * @returns {400 {message:string}} Email et mot de passe requis
 * @returns {401 {message:string}} Identifiants invalides
 */
// PUBLIC: /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Identifiants invalides' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  res.json({ token, user: { email: user.email, username: user.username } });
});

// PUBLIC: /api/logout (stateless)
router.get('/logout', (_req, res) => {
  res.json({ message: 'Logged out' });
});

export default router;


