// /public/js/auth.js
// Gère la connexion (login) côté front.

import { Auth } from './api.js';

const form = document.getElementById('login-form');
const msg = document.getElementById('login-msg');
const submitBtn = form?.querySelector('button[type="submit"]');

// Affiche un message d'erreur / succès sous le formulaire
function showMessage(text, isError = true) {
  if (!msg) return;
  msg.textContent = text || '';
  msg.classList.toggle('error', isError);
  msg.classList.toggle('ok', !isError);
}

async function handleLogin(e) {
  e.preventDefault();
  if (!form) return;

  const email = form.email.value.trim();
  const password = form.password.value;

  showMessage('');
  if (submitBtn) submitBtn.disabled = true;

  try {
    await Auth.login(email, password); 
    showMessage('Connexion réussie', false);

    window.location.href = '/dashboard.html';
   
  } catch (err) {
    showMessage(err.message || 'Échec de connexion', true);
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

// Active le handler si le formulaire est présent
if (form) {
  form.addEventListener('submit', handleLogin);
}

// (Optionnel) Bouton de déconnexion si présent sur d'autres pages
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    Auth.logout(); // retire token + user du localStorage
    window.location.href = '/';
  });
}

// (Optionnel) Affiche l'utilisateur courant si un placeholder existe
const who = document.getElementById('whoami');
if (who) {
  const u = Auth.currentUser();
  who.textContent = u ? `${u.username} (${u.email})` : 'Non connecté';
}

