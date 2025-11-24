const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Admin routes only
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers);
router.get('/:id', authenticateToken, requireAdmin, userController.getUser);
router.post('/', authenticateToken, requireAdmin, userController.createUser);
router.put('/:id', authenticateToken, requireAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);
router.post('/:id/suspend', authenticateToken, requireAdmin, userController.suspendUser);
router.post('/:id/unsuspend', authenticateToken, requireAdmin, userController.unsuspendUser);

module.exports = router;
