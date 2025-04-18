const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');
const { authMiddleware, authorizeRoles } = require('../middleware/auth.middleware');

// Apply auth middleware to all routes in this router
router.use(authMiddleware);
router.use(authorizeRoles('incubator', 'admin'));

// Search routes
router.get('/global', searchController.globalSearch);
router.get('/startups', searchController.searchStartups);
router.get('/team-members', searchController.searchTeamMembers);
router.get('/intellectual-properties', searchController.searchIntellectualProperties);
router.get('/funding-rounds', searchController.searchFundingRounds);

module.exports = router; 