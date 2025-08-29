export const swaggerSpec = {
  openapi: '3.0.3',
  info: { title: 'Russell Marina API', version: '1.0.0' },
  servers: [{ url: '/api' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      User: {
        type: 'object',
        properties: { username: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } },
        required: ['username', 'email', 'password']
      },
      Catway: {
        type: 'object',
        properties: { catwayNumber: { type: 'integer' }, catwayType: { type: 'string', enum: ['long','short'] }, catwayState: { type: 'string' } },
        required: ['catwayNumber','catwayType','catwayState']
      },
      Reservation: {
        type: 'object',
        properties: { catwayNumber: { type: 'integer' }, clientName: { type: 'string' }, boatName: { type: 'string' }, startDate: { type: 'string', format: 'date-time' }, endDate: { type: 'string', format: 'date-time' } },
        required: ['clientName','boatName','startDate','endDate']
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/login': {
      post: {
        security: [],
        summary: 'Connexion',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email','password'] } } } },
        responses: { '200': { description: 'OK' } }
      }
    },
    '/logout': { get: { summary: 'Déconnexion', responses: { '200': { description: 'OK' } } } },
    '/users': {
      get: { summary: 'Lister les utilisateurs', responses: { '200': { description: 'OK' } } },
      post: { summary: 'Créer un utilisateur', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, responses: { '201': { description: 'Créé' } } }
    },
    '/users/{email}': {
      get: { summary: "Détail d'un utilisateur", parameters: [{ name: 'email', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } } },
      put: { summary: 'Modifier un utilisateur', parameters: [{ name: 'email', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object' } } } }, responses: { '200': { description: 'OK' } } },
      delete: { summary: 'Supprimer un utilisateur', parameters: [{ name: 'email', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'No content' } } }
    },
    '/catways': {
      get: { summary: 'Lister les catways', responses: { '200': { description: 'OK' } } },
      post: { summary: 'Créer un catway', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Catway' } } } }, responses: { '201': { description: 'Créé' } } }
    },
    '/catways/{id}': {
      get: { summary: 'Détail catway', parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }], responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } } },
      put: { summary: "MAJ de l'état du catway", parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { catwayState: { type: 'string' } }, required: ['catwayState'] } } } }, responses: { '200': { description: 'OK' } } },
      delete: { summary: 'Supprimer', parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }], responses: { '204': { description: 'No content' } } }
    },
    '/catways/{id}/reservations': {
      get: { summary: 'Lister les réservations du catway', parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }], responses: { '200': { description: 'OK' } } },
      post: { summary: 'Créer une réservation', parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Reservation' } } } }, responses: { '201': { description: 'Créé' } } }
    },
    '/catways/{id}/reservations/{reservationId}': {
      get: { summary: 'Détail réservation', parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }, { name: 'reservationId', in: 'path', schema: { type: 'string' }, required: true }], responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } } },
      put: { summary: 'Modifier réservation', parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }, { name: 'reservationId', in: 'path', schema: { type: 'string' }, required: true }], requestBody: { content: { 'application/json': { schema: { type: 'object' } } } }, responses: { '200': { description: 'OK' } } },
      delete: { summary: 'Supprimer réservation', parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }, { name: 'reservationId', in: 'path', schema: { type: 'string' }, required: true }], responses: { '204': { description: 'No content' } } }
    }
  }
};
