import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const seed = { royalties: [], collaborators: [], payouts: [], payoutRecipients: [], notifications: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
  }
}

function read() {
  ensure();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function write(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export const store = {
  // Off-chain royalties
  listRoyalties() {
    const db = read();
    return db.royalties;
  },
  addRoyalty(r) {
    const db = read();
    db.royalties.push(r);
    write(db);
    return r;
  },
  // Collaborators
  listCollaborators() {
    const db = read();
    return db.collaborators;
  },
  addCollaborator(c) {
    const db = read();
    db.collaborators.push(c);
    write(db);
    return c;
  },
  updateCollaborator(id, patch) {
    const db = read();
    const idx = db.collaborators.findIndex(x => x.id === id);
    if (idx === -1) return null;
    db.collaborators[idx] = { ...db.collaborators[idx], ...patch };
    write(db);
    return db.collaborators[idx];
  },
  deleteCollaborator(id) {
    const db = read();
    const before = db.collaborators.length;
    db.collaborators = db.collaborators.filter(x => x.id !== id);
    write(db);
    return db.collaborators.length < before;
  },
  // Payout jobs
  createPayout(job) {
    const db = read();
    db.payouts.push(job);
    write(db);
    return job;
  },
  listPayouts(limit = 50) {
    const db = read();
    return db.payouts.sort((a,b) => b.createdAt - a.createdAt).slice(0, limit);
  },
  getPayout(id) {
    const db = read();
    return db.payouts.find(p => p.id === id) || null;
  },
  updatePayout(id, patch) {
    const db = read();
    const idx = db.payouts.findIndex(p => p.id === id);
    if (idx === -1) return null;
    db.payouts[idx] = { ...db.payouts[idx], ...patch };
    write(db);
    return db.payouts[idx];
  },
};
