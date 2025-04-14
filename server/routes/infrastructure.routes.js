const express = require('express');
const router = express.Router();
const infrastructureController = require('../controllers/infrastructure.controller');

// Get all infrastructure
router.get('/', infrastructureController.getAllInfrastructure);

// Get infrastructure by ID
router.get('/:id', infrastructureController.getInfrastructureById);

// Create new infrastructure
router.post('/', infrastructureController.createInfrastructure);

// Update infrastructure
router.put('/:id', infrastructureController.updateInfrastructure);

// Delete infrastructure
router.delete('/:id', infrastructureController.deleteInfrastructure);

module.exports = router; 