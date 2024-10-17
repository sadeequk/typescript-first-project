import Joi from 'joi'

const registerSchema = Joi.object({
  firstName: Joi.string()
    .max(30)
    .when('fullName', {
      is: Joi.exist(),
      then: Joi.forbidden().messages({
        'any.unknown':
          'Validation Error: First name is not allowed when full name is provided'
      }),
      otherwise: Joi.required().messages({
        'any.required':
          'Error: Either provide first name and last name or provide full name'
      })
    })
    .messages({
      'string.base': 'Validation Error: First name must be a string',
      'string.empty': 'Validation Error: First name cannot be empty',
      'string.max': 'Validation Error: First name cannot exceed 30 characters'
    }),
  lastName: Joi.string()
    .max(30)
    .when('fullName', {
      is: Joi.exist(),
      then: Joi.forbidden().messages({
        'any.unknown':
          'Validation Error: Last name is not allowed when full name is provided'
      }),
      otherwise: Joi.required().messages({
        'any.required':
          'Error: Either provide first name and last name or provide full name'
      })
    })
    .messages({
      'string.base': 'Validation Error: Last name must be a string',
      'string.empty': 'Validation Error: Last name cannot be empty',
      'string.max': 'Validation Error: Last name cannot exceed 30 characters'
    }),
  fullName: Joi.string()
    .pattern(/^[A-Za-z]+ [A-Za-z]+$/)
    .optional()
    .messages({
      'string.base': 'Validation Error: Full name must be a string',
      'string.empty': 'Validation Error: Full name cannot be empty',
      'string.pattern.base':
        'Validation Error: Invalid name, please provide full name'
    }),
  email: Joi.string().email().required().messages({
    'string.base': 'Validation Error: Email must be a string',
    'string.empty': 'Validation Error: Email cannot be empty',
    'string.email': 'Validation Error: Invalid email',
    'any.required': 'Error: Email is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Validation Error: Password must be a string',
    'string.empty': 'Validation Error: Password cannot be empty',
    'string.min':
      'Validation Error: Password must be at least 8 characters long',
    'any.required': 'Error: Password is required'
  }),
  phone: Joi.string()
    .pattern(/^(\+)?(\(?\d+\)?)(([\s-]+)?(\d+)){0,}$/)
    .optional()
    .messages({
      'string.base': 'Validation Error: Phone number must be a string',
      'string.empty': 'Validation Error: Phone number cannot be empty',
      'string.pattern.base': 'Validation Error: Invalid phone number format'
    })
})
  .unknown(false)
  .strip(true)

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Validation Error: Email must be a string',
    'string.empty': 'Validation Error: Email cannot be empty',
    'string.email': 'Validation Error: Invalid email',
    'any.required': 'Error: Email is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Validation Error: Password must be a string',
    'string.empty': 'Validation Error: Password cannot be empty',
    'string.min': 'Error: Incorrect password!',
    'any.required': 'Error: Password is required'
  })
})
  .unknown(false)
  .strip(true)

const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .max(30)
    .when('fullName', {
      is: Joi.exist(),
      then: Joi.forbidden().messages({
        'any.unknown':
          'Validation Error: First name is not allowed when full name is provided'
      }),
      otherwise: Joi.optional()
    })
    .messages({
      'string.base': 'Validation Error: First name must be a string',
      'string.empty': 'Validation Error: First name cannot be empty',
      'string.max': 'Validation Error: First name cannot exceed 30 characters'
    }),
  lastName: Joi.string()
    .max(30)
    .when('fullName', {
      is: Joi.exist(),
      then: Joi.forbidden().messages({
        'any.unknown':
          'Validation Error: Last name is not allowed when full name is provided'
      }),
      otherwise: Joi.optional()
    })
    .messages({
      'string.base': 'Validation Error: Last name must be a string',
      'string.empty': 'Validation Error: Last name cannot be empty',
      'string.max': 'Validation Error: Last name cannot exceed 30 characters'
    }),
  fullName: Joi.string()
    .pattern(/^[A-Za-z]+ [A-Za-z]+$/)
    .optional()
    .messages({
      'string.base': 'Validation Error: Full name must be a string',
      'string.empty': 'Validation Error: Full name cannot be empty',
      'string.pattern.base':
        'Validation Error: Invalid name, please provide full name'
    }),
  email: Joi.string().email().optional().messages({
    'string.base': 'Validation Error: Email must be a string',
    'string.empty': 'Validation Error: Email cannot be empty',
    'string.email': 'Validation Error: Invalid email'
  }),
  oldPassword: Joi.string()
    .min(8)
    .when('password', {
      is: Joi.exist(),
      then: Joi.required().messages({
        'any.required':
          'Validation Error: Please enter your old password to update password'
      }),
      otherwise: Joi.optional()
    })
    .messages({
      'string.base': 'Validation Error: Old password must be a string',
      'string.empty': 'Validation Error: Old password cannot be empty',
      'string.min': 'Error: Incorrect old password'
    }),
  password: Joi.string().min(8).optional().messages({
    'string.base': 'Validation Error: Password must be a string',
    'string.empty': 'Validation Error: Password cannot be empty',
    'string.min':
      'Validation Error: Password must be at least 8 characters long'
  }),
  phone: Joi.string()
    .pattern(/^(\+)?(\(?\d+\)?)(([\s-]+)?(\d+)){0,}$/)
    .optional()
    .messages({
      'string.base': 'Validation Error: Phone number must be a string',
      'string.empty': 'Validation Error: Phone number cannot be empty',
      'string.pattern.base': 'Validation Error: Invalid phone number format'
    })
})

const updateCustomizationSchema = Joi.object({
  company: Joi.string().max(30).optional().messages({
    'string.base': 'Validation Error: Company name must be a string',
    'string.empty': 'Validation Error: Company name cannot be empty',
    'string.max': 'Validation Error: Company name cannot exceed 30 characters'
  }),
  primaryColor: Joi.string()
    .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .optional()
    .messages({
      'string.base': 'Validation Error: Primary color must be a string',
      'string.empty': 'Validation Error: Primary color cannot be empty',
      'string.pattern.base':
        'Validation Error: Invalid hex code, please provide a valid hex code for primary color'
    })
})

export default {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateCustomizationSchema
}
