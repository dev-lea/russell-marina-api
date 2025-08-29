import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { User } from '../models/User.js';

const router = express.Router();
router.use(requireAuth);

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.get('/users/:email', async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.post('/users', validate(schemas.userCreate), async (req, res, next) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(409).json({ message: 'Email already used' });
    const user = await User.create(req.body);
    res.status(201).json({ email: user.email, username: user.username });
  } catch (e) { next(e); }
});

router.put('/users/:email', validate(schemas.userUpdate), async (req, res) => {
  const { email } = req.params;
  const updates = { ...req.body };
  if (updates.password) delete updates.password;
  const user = await User.findOneAndUpdate({ email }, updates, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.delete('/users/:email', async (req, res) => {
  const deleted = await User.findOneAndDelete({ email: req.params.email });
  if (!deleted) return res.status(404).json({ message: 'User not found' });
  res.status(204).end();
});

export default router;
