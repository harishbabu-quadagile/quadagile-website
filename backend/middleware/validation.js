const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

// Sanitization options
const sanitizeOptions = {
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'
  ],
  allowedAttributes: {
    'a': ['href', 'title', 'target'],
    'img': ['src', 'alt', 'title'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

const sanitizeContent = (content) => {
  return sanitizeHtml(content, sanitizeOptions);
};

// Blog validation rules
const blogValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('excerpt')
    .trim()
    .notEmpty()
    .withMessage('Excerpt is required')
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .custom((value) => {
      return sanitizeContent(value);
    }),
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be draft or published'),
  handleValidationErrors,
];

// Case study validation rules
const caseStudyValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),
  body('subtitle')
    .trim()
    .notEmpty()
    .withMessage('Subtitle is required'),
  body('excerpt')
    .trim()
    .notEmpty()
    .withMessage('Excerpt is required'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .custom((value) => sanitizeContent(value)),
  body('clientName')
    .trim()
    .notEmpty()
    .withMessage('Client name is required'),
  body('industry')
    .trim()
    .notEmpty()
    .withMessage('Industry is required'),
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Duration is required'),
  handleValidationErrors,
];

// Contact form validation
const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name contains invalid characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company must be less than 100 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters'),
  body('recaptchaToken')
    .notEmpty()
    .withMessage('reCAPTCHA token is required'),
  handleValidationErrors,
];

// Login validation
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

module.exports = {
  blogValidation,
  caseStudyValidation,
  contactValidation,
  loginValidation,
  sanitizeContent,
  handleValidationErrors,
};
