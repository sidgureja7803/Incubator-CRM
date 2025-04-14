const express = require('express');
const router = express.Router();
const startupController = require('../controllers/startup.controller');

// Get all startups
router.get('/', startupController.getAllStartups);

// Get startup by ID
router.get('/:id', startupController.getStartupById);

// Create new startup
router.post('/', startupController.createStartup);

// Update startup
router.put('/:id', startupController.updateStartup);

// Delete startup
router.delete('/:id', startupController.deleteStartup);

// Application routes
router.post('/:id/apply', startupController.applyToProgram);
router.get('/:id/applications', startupController.getApplications);
router.put('/:id/applications/:applicationId/status', startupController.updateApplicationStatus);

module.exports = router; 