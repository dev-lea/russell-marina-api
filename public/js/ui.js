import { Auth, Users, Catways, Reservations } from './api.js';

const userSpan = document.querySelector('#user');
const todaySpan = document.querySelector('#today');
const logoutBtn = document.querySelector('#logout');

if (userSpan) userSpan.textContent = (Auth.currentUser()?.username || '') + ' — ' + (Auth.currentUser()?.email || '');
if (todaySpan) todaySpan.textContent = new Date().toLocaleDateString();
logoutBtn?.addEventListener('click', () => { Auth.logout(); window.location.href = '/'; });

async function loadDashboard() {
  const table = document.querySelector('#ongoing');
  if (!table) return;
  const catways = await Catways.list();
  const today = new Date();
  const rows = [];
  for (const c of catways) {
    const list = await Reservations.listFor(c.catwayNumber);
    list.filter(r => new Date(r.startDate) <= today && new Date(r.endDate) >= today)
        .forEach(r => rows.push({ ...r, catwayType: c.catwayType }));
  }
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = rows.map(r => `<tr>
    <td>${r.catwayNumber}</td><td>${r.catwayType}</td><td>${r.clientName}</td><td>${r.boatName}</td>
    <td>${new Date(r.startDate).toLocaleDateString()}</td><td>${new Date(r.endDate).toLocaleDateString()}</td>
  </tr>`).join('');
}

async function loadUsers() {
  const listEl = document.querySelector('#users-list');
  if (!listEl) return;
  const users = await Users.list();
  listEl.innerHTML = users.map(u => `<tr><td>${u.username}</td><td>${u.email}</td>
    <td class="actions"><button data-act="del" data-email="${u.email}">🗑️</button></td></tr>`).join('');
  listEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('button'); if (!btn) return;
    if (btn.dataset.act === 'del') { await Users.remove(btn.dataset.email); loadUsers(); }
  });
  const form = document.querySelector('#user-form');
  form.addEventListener('submit', async (e) => { e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    await Users.create(data); form.reset(); loadUsers();
  });
}

async function loadCatways() {
  const listEl = document.querySelector('#catways-list');
  if (!listEl) return;
  const catways = await Catways.list();
  listEl.innerHTML = catways.map(c => `<tr><td>${c.catwayNumber}</td><td>${c.catwayType}</td>
    <td><input data-id="${c.catwayNumber}" value="${c.catwayState}"></td>
    <td class="actions"><button data-id="${c.catwayNumber}">💾</button> <button data-del="${c.catwayNumber}">🗑️</button></td></tr>`).join('');
  listEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('button'); if (!btn) return;
    if (btn.dataset.id) {
      const input = listEl.querySelector(`input[data-id="${btn.dataset.id}"]`);
      await Catways.updateState(btn.dataset.id, input.value); loadCatways();
    }
    if (btn.dataset.del) { await Catways.remove(btn.dataset.del); loadCatways(); }
  });
  const form = document.querySelector('#catway-form');
  form.addEventListener('submit', async (e) => { e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    data.catwayNumber = Number(data.catwayNumber);
    await Catways.create(data); form.reset(); loadCatways();
  });
}

async function loadReservations() {
  const listEl = document.querySelector('#res-list');
  if (!listEl) return;
  const sel = document.querySelector('#res-catway');
  const catways = await Catways.list();
  sel.innerHTML = catways.map(c => `<option value="${c.catwayNumber}">${c.catwayNumber} (${c.catwayType})</option>`).join('');

  async function refresh() {
    const id = sel.value; const list = await Reservations.listFor(id);
    listEl.innerHTML = list.map(r => `<tr>
      <td>${r.clientName}</td><td>${r.boatName}</td>
      <td>${new Date(r.startDate).toLocaleDateString()}</td>
      <td>${new Date(r.endDate).toLocaleDateString()}</td>
      <td class="actions"><button data-id="${r._id}">🗑️</button></td>
    </tr>`).join('');
  }
  sel.addEventListener('change', refresh);
  await refresh();

  const form = document.querySelector('#res-form');
  form.addEventListener('submit', async (e) => { e.preventDefault();
    const id = sel.value;
    const data = Object.fromEntries(new FormData(form).entries());
    await Reservations.create(id, data); form.reset(); refresh();
  });

  listEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('button'); if (!btn) return;
    if (btn.dataset.id) { await Reservations.remove(sel.value, btn.dataset.id); refresh(); }
  });
}

loadDashboard();
loadUsers();
loadCatways();
loadReservations();
