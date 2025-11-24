const express = require('express');
const router = express.Router();
const serverController = require('../controllers/serverController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// User routes (own servers)
router.get('/', authenticateToken, serverController.getAllServers);
router.get('/:id', authenticateToken, serverController.getServer);
router.post('/', authenticateToken, serverController.createServer);
router.delete('/:id', authenticateToken, serverController.deleteServer);
router.post('/:id/power', authenticateToken, serverController.sendPowerAction);

// Admin routes
router.post('/:id/suspend', authenticateToken, requireAdmin, serverController.suspendServer);
router.post('/:id/unsuspend', authenticateToken, requireAdmin, serverController.unsuspendServer);

module.exports = router;
