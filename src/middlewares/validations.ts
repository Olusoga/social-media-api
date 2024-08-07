import Joi from 'joi';

export const signupSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Enter a valid email address'
  }),
  password: Joi.string().min(6).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$')).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'string.pattern.base': 'Password must contain at least one lowercase letter,at least  one uppercase letter, at least one number, and at least one special character'
  })
});

export const createPostValidationSchema = Joi.object({
  content: Joi.string().required().messages({
    'string.empty': 'Content cannot be empty',
    'any.required': 'Content is required',
  }),
  imageUrl: Joi.string().uri().optional(),
  videoUrl: Joi.string().uri().optional(),
});