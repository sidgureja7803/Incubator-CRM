const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { authMiddleware, authorizeRoles } = require('../middleware/auth.middleware');
const startupController = require('../controllers/startup.controller');

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

// Get startup details
router.get('/:startupId', startupController.getStartupDetails);

// Get startup intellectual properties
router.get('/:startupId/intellectualproperties', startupController.getStartupIPs);

// Get startup fees
router.get('/:startupId/fees', startupController.getStartupFees);

// Create a new startup (incubator or admin only)
router.post(
  '/',
  authorizeRoles('incubator', 'admin'),
  [
    check('startup_name', 'Startup name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ],
  startupController.createStartup
);

// Update a startup
router.patch(
  '/:startupId',
  authorizeRoles('incubator', 'admin', 'startup'),
  startupController.updateStartup
);

// Add a team member to a startup
router.post(
  '/:startupId/team',
  authorizeRoles('incubator', 'admin', 'startup'),
  [
    check('name', 'Name is required').not().isEmpty(),
    check('position', 'Position is required').not().isEmpty()
  ],
  startupController.createTeamMember
);

// Add intellectual property to a startup
router.post(
  '/:startupId/intellectualproperties',
  authorizeRoles('incubator', 'admin', 'startup'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('type', 'Type is required').isIn(['Patent', 'Trademark', 'Copyright', 'Trade Secret', 'Other']),
  ],
  startupController.createIntellectualProperty
);

// Add funding round to a startup
router.post(
  '/:startupId/funding',
  authorizeRoles('incubator', 'admin', 'startup'),
  [
    check('round_type', 'Round type is required').isIn(['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Grant', 'Other']),
    check('amount', 'Amount is required and must be a number').isNumeric(),
    check('date', 'Date is required').isISO8601().toDate()
  ],
  startupController.createFundingRound
);

// Add update to a startup
router.post(
  '/:startupId/updates',
  authorizeRoles('incubator', 'admin', 'startup'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('month', 'Month is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty()
  ],
  startupController.createUpdate
);

module.exports = router; 