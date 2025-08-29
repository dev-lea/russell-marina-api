import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../src/db.js';
import { Catway } from '../src/models/Catway.js';
import { Reservation } from '../src/models/Reservation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  await connectDB();
  const catways = JSON.parse(await fs.readFile(path.join(__dirname, '../data/catways.json'), 'utf8'));
  const reservations = JSON.parse(await fs.readFile(path.join(__dirname, '../data/reservations.json'), 'utf8'));
  await Catway.deleteMany({});
  await Reservation.deleteMany({});
  await Catway.insertMany(catways);
  await Reservation.insertMany(reservations);
  console.log('✔ Seed completed');
  process.exit(0);
}
run();
