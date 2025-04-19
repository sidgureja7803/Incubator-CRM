const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authMiddleware, authorizeRoles } = require('../middleware/auth.middleware');
const { cacheMiddleware } = require('../utils/redisClient');

// Apply auth middleware to all routes in this router
router.use(authMiddleware);
router.use(authorizeRoles('incubator', 'admin'));

// Apply cache middleware with 5 minutes TTL for all GET requests
router.use(cacheMiddleware(300));

// Dashboard routes
router.get('/metrics', dashboardController.getDashboardMetrics);
router.get('/startups-by-status', dashboardController.getStartupsByStatus);
router.get('/funding-metrics', dashboardController.getFundingMetrics);
router.get('/fee-metrics', dashboardController.getFeeCollectionMetrics);
router.get('/recent-activities', dashboardController.getRecentActivities);

module.exports = router; 