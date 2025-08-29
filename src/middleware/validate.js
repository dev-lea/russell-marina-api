// src/middleware/validate.js
import Joi from 'joi';

export function validate(schema) {
  return (req, res, next) => {
    const toValidate = { body: req.body, params: req.params, query: req.query };
    const { error, value } = schema.validate(toValidate, {
      abortEarly: false,
      stripUnknown: { objects: true }, // retire les champs inattendus
      convert: true,                    // convertit types simples (ex: "123" -> 123 si besoin)
    });
    if (!error) {
      // remet les valeurs nettoyées
      req.body = value.body ?? req.body;
      req.params = value.params ?? req.params;
      req.query = value.query ?? req.query;
      return next();
    }
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details.map(d => d.message),
    });
  };
}

const emailAnyTLD = Joi.string().email({ tlds: false }).messages({
  'string.email': 'Email invalide',
  'string.empty': 'Email requis',
  'any.required': 'Email requis',
});

export const schemas = {
  // LOGIN
  login: Joi.object({
    body: Joi.object({
      email: emailAnyTLD.required(),
      password: Joi.string().min(8).required().messages({
        'string.min': 'Mot de passe trop court (min 8)',
        'string.empty': 'Mot de passe requis',
        'any.required': 'Mot de passe requis',
      }),
    }),
    params: Joi.object(),
    query: Joi.object(),
  }),

  // USERS
  userCreate: Joi.object({
    body: Joi.object({
      username: Joi.string().min(2).required().messages({
        'string.min': 'Nom d’utilisateur trop court (min 2)',
        'any.required': 'Nom d’utilisateur requis',
      }),
      email: emailAnyTLD.required(),
      password: Joi.string().min(8).required().messages({
        'string.min': 'Mot de passe trop court (min 8)',
        'any.required': 'Mot de passe requis',
      }),
    }),
    params: Joi.object(),
    query: Joi.object(),
  }),

  userUpdate: Joi.object({
    body: Joi.object({
      username: Joi.string().min(2).messages({
        'string.min': 'Nom d’utilisateur trop court (min 2)',
      }),
      password: Joi.string().min(8).messages({
        'string.min': 'Mot de passe trop court (min 8)',
      }),
    }),
    params: Joi.object({
      email: emailAnyTLD.required(),
    }),
    query: Joi.object(),
  }),

  // CATWAYS
  catwayCreate: Joi.object({
    body: Joi.object({
      catwayNumber: Joi.number().integer().min(1).required(),
      catwayType: Joi.string().valid('long', 'short').required(),
      catwayState: Joi.string().required(),
    }),
    params: Joi.object(),
    query: Joi.object(),
  }),

  catwayUpdate: Joi.object({
    body: Joi.object({
      catwayState: Joi.string().required(),
    }),
    params: Joi.object({
      id: Joi.number().integer().min(1).required(),
    }),
    query: Joi.object(),
  }),

  // RESERVATIONS
  reservationCreate: Joi.object({
    body: Joi.object({
      clientName: Joi.string().required(),
      boatName: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
    }),
    params: Joi.object({
      id: Joi.number().integer().min(1).required(),
    }),
    query: Joi.object(),
  }),

  reservationUpdate: Joi.object({
    body: Joi.object({
      clientName: Joi.string(),
      boatName: Joi.string(),
      startDate: Joi.date(),
      endDate: Joi.date(),
    }).min(1),
    params: Joi.object({
      id: Joi.number().integer().min(1).required(),
      reservationId: Joi.string().required(),
    }),
    query: Joi.object(),
  }),
};
