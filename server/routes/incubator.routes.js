const express = require('express');
const router = express.Router();
const incubatorController = require('../controllers/incubator.controller');

// Get all incubators
router.get('/', incubatorController.getAllIncubators);

// Get incubator by ID
router.get('/:id', incubatorController.getIncubatorById);

// Create new incubator
router.post('/', incubatorController.createIncubator);

// Update incubator
router.put('/:id', incubatorController.updateIncubator);

// Delete incubator
router.delete('/:id', incubatorController.deleteIncubator);

// Program routes
router.post('/:id/programs', incubatorController.addProgram);
router.put('/:id/programs/:programId', incubatorController.updateProgram);
router.delete('/:id/programs/:programId', incubatorController.deleteProgram);

module.exports = router; 