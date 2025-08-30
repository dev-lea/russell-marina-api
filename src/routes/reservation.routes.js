import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { Catway } from '../models/Catway.js';
import { Reservation } from '../models/Reservation.js';

const router = express.Router({ mergeParams: true });
router.use(requireAuth);

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && aEnd >= bStart;
}

async function assertReservable(catwayNumber, startDate, endDate, ignoreId) {
  const cat = await Catway.findOne({ catwayNumber });
  if (!cat) throw Object.assign(new Error('Catway not found'), { status: 404 });
  if (/ne peut être réservée|réparation/i.test(cat.catwayState)) {
    throw Object.assign(new Error('Catway is not reservable'), { status: 400 });
  }
  const start = new Date(startDate); const end = new Date(endDate);
  if (!(start < end)) throw Object.assign(new Error('startDate must be before endDate'), { status: 400 });
  const existing = await Reservation.find({ catwayNumber });
  const clash = existing.find(r => r._id.toString() !== (ignoreId || '') && overlaps(start, end, r.startDate, r.endDate));
  if (clash) throw Object.assign(new Error('Overlapping reservation exists'), { status: 409 });
}

router.get('/catways/:id/reservations', async (req, res) => {
  const list = await Reservation.find({ catwayNumber: Number(req.params.id) }).sort({ startDate: 1 });
  res.json(list);
});

router.get('/catways/:id/reservations/:reservationId', async (req, res) => {
  const r = await Reservation.findOne({ _id: req.params.reservationId, catwayNumber: Number(req.params.id) });
  if (!r) return res.status(404).json({ message: 'Reservation not found' });
  res.json(r);
});

/**
 * Crée une réservation pour un catway donné.
 * Contraintes: startDate < endDate ; anti-chevauchement sur le même catwayNumber.
 * @route POST /catways/:id/reservations
 * @param {express.Request} req - Params: { id } ; Body: { clientName, boatName, startDate, endDate }
 * @param {express.Response} res
 * @returns {201 Created} Réservation créée
 * @returns {400 Bad Request} Validation invalide (dates/champs ou catway non réservable)
 * @returns {409 Conflict} Chevauchement détecté sur ce catway
 */
router.post('/catways/:id/reservations', validate(schemas.reservationCreate), async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    const { clientName, boatName, startDate, endDate } = req.body;
    await assertReservable(catwayNumber, startDate, endDate);
    const created = await Reservation.create({ catwayNumber, clientName, boatName, startDate, endDate });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put('/catways/:id/reservations/:reservationId', validate(schemas.reservationUpdate), async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    const reservationId = req.params.reservationId;
    const current = await Reservation.findOne({ _id: reservationId, catwayNumber });
    if (!current) return res.status(404).json({ message: 'Reservation not found' });
    const startDate = req.body.startDate ?? current.startDate;
    const endDate = req.body.endDate ?? current.endDate;
    await assertReservable(catwayNumber, startDate, endDate, reservationId);
    Object.assign(current, req.body);
    await current.save();
    res.json(current);
  } catch (e) { next(e); }
});

router.delete('/catways/:id/reservations/:reservationId', async (req, res) => {
  const deleted = await Reservation.findOneAndDelete({ _id: req.params.reservationId, catwayNumber: Number(req.params.id) });
  if (!deleted) return res.status(404).json({ message: 'Reservation not found' });
  res.status(204).end();
});

export default router;

