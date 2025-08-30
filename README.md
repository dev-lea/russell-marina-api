# Russell Marina — API & Mini-Frontend

Application Express + MongoDB (JWT), docs Swagger et frontend léger.

## Stack
Node 20, Express, Mongoose, JWT, Joi, Swagger UI, HTML/CSS/JS.

## Fonctionnalités
- Auth (JWT)
- Users CRUD
- Catways CRUD
- Reservations CRUD (anti-chevauchement)
- Docs Swagger à `/docs`
- Frontend: `/`, `/dashboard.html`, `/users.html`, `/catways.html`, `/reservations.html`

## Démarrage
1. `cp .env.example .env` et renseigner les variables.
2. `npm install` puis `npm run dev`.
3. Importer les données : voir section *Import*.

## Import des données
```bash
mongoimport --jsonArray --db marina --collection catways --file data/catways.json
mongoimport --jsonArray --db marina --collection reservations --file data/reservations.json
```

## Déploiement
- MongoDB Atlas + Railway/Render/Fly.io. Configurer les variables d’env.

## Identifiants de test
- Email : admin@russell-port.tld
- Mot de passe : admin1234

## Licence
MIT

## Liens de démo
- GitHub: https://github.com/dev-lea/russell-marina-api
- Déployé: https://russell-marina-api.onrender.com

### How to run (local, Windows/VS Code)
```powershell
npm install
copy .env.example .env
npm run dev

