const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const incubatorController = require('../controllers/incubator.controller');
const { authMiddleware, authorizeRoles } = require('../middleware/auth.middleware');

// Apply auth middleware to all routes in this router
router.use(authMiddleware);
router.use(authorizeRoles('incubator', 'admin'));

// Get incubator profile
router.get('/profile', incubatorController.getProfile);

// Update incubator profile
router.patch(
  '/profile',
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('location.city', 'City is required').optional().not().isEmpty(),
    check('location.state', 'State is required').optional().not().isEmpty(),
    check('location.country', 'Country is required').optional().not().isEmpty(),
    check('contact.email', 'Valid email is required').optional().isEmail(),
  ],
  incubatorController.updateProfile
);

// Get all startups for the incubator
router.get('/startups', incubatorController.getStartups);

// Get specific startup details
router.get('/startups/:startupId', incubatorController.getStartupDetails);

// Create fee for a startup
router.post(
  '/startups/:startupId/fees',
  [
    check('amount', 'Amount is required and must be a number').isNumeric(),
    check('type', 'Fee type is required').not().isEmpty(),
    check('frequency', 'Frequency is required').isIn(['monthly', 'quarterly', 'yearly', 'one-time']),
    check('due_date', 'Due date is required').isISO8601().toDate()
  ],
  incubatorController.createFee
);

// Get regular updates from startups
router.get('/view-regular-updates', incubatorController.getRegularUpdates);

// Get startup intellectual properties
router.get('/startups/:startupId/intellectualproperties', incubatorController.getStartupIntellectualProperties);

module.exports = router; 