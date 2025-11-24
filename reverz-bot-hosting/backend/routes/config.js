const express = require('express');
const router = express.Router();
const apiConfigController = require('../controllers/apiConfigController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// API Configuration routes (Admin only)
router.get('/', authenticateToken, requireAdmin, apiConfigController.getConfig);
router.put('/', authenticateToken, requireAdmin, apiConfigController.updateConfig);

// Egg Templates routes (Admin only)
router.get('/eggs', authenticateToken, requireAdmin, apiConfigController.getEggTemplates);
router.post('/eggs', authenticateToken, requireAdmin, apiConfigController.createEggTemplate);
router.put('/eggs/:id', authenticateToken, requireAdmin, apiConfigController.updateEggTemplate);
router.delete('/eggs/:id', authenticateToken, requireAdmin, apiConfigController.deleteEggTemplate);

module.exports = router;
