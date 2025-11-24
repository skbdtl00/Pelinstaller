const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public/user routes
router.get('/', authenticateToken, planController.getAllPlans);
router.get('/:id', authenticateToken, planController.getPlan);

// Admin routes
router.post('/', authenticateToken, requireAdmin, planController.createPlan);
router.put('/:id', authenticateToken, requireAdmin, planController.updatePlan);
router.delete('/:id', authenticateToken, requireAdmin, planController.deletePlan);

module.exports = router;
