import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { Catway } from '../models/Catway.js';

const router = express.Router();
router.use(requireAuth);

router.get('/catways', async (req, res) => {
  const list = await Catway.find().sort({ catwayNumber: 1 });
  res.json(list);
});

router.get('/catways/:id', async (req, res) => {
  const c = await Catway.findOne({ catwayNumber: req.params.id });
  if (!c) return res.status(404).json({ message: 'Catway not found' });
  res.json(c);
});

router.post('/catways', validate(schemas.catwayCreate), async (req, res, next) => {
  try {
    const exists = await Catway.findOne({ catwayNumber: req.body.catwayNumber });
    if (exists) return res.status(409).json({ message: 'catwayNumber already exists' });
    const created = await Catway.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put('/catways/:id', validate(schemas.catwayUpdate), async (req, res) => {
  const updated = await Catway.findOneAndUpdate(
    { catwayNumber: req.params.id },
    { catwayState: req.body.catwayState },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Catway not found' });
  res.json(updated);
});

router.delete('/catways/:id', async (req, res) => {
  const deleted = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
  if (!deleted) return res.status(404).json({ message: 'Catway not found' });
  res.status(204).end();
});

export default router;
