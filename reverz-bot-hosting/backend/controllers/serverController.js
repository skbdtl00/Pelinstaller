const { Server, Plan, User } = require('../models');
const pelicanClient = require('../utils/pelicanClient');

// Get all servers (filtered by user or all for admin)
exports.getAllServers = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin' || req.user.role === 'support';
    const where = isAdmin ? {} : { user_id: req.user.id };

    const servers = await Server.findAll({
      where,
      include: [
        { model: Plan, as: 'plan' },
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] }
      ]
    });

    res.json(servers);
  } catch (error) {
    console.error('Get servers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single server
exports.getServer = async (req, res) => {
  try {
    const { id } = req.params;
    const server = await Server.findByPk(id, {
      include: [
        { model: Plan, as: 'plan' },
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] }
      ]
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && req.user.role !== 'support' && server.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(server);
  } catch (error) {
    console.error('Get server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create server
exports.createServer = async (req, res) => {
  try {
    const { name, plan_id, runtime, user_id } = req.body;

    // Admin can create for any user, regular user creates for themselves
    const targetUserId = req.user.role === 'admin' ? (user_id || req.user.id) : req.user.id;

    if (!name || !plan_id || !runtime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Check if runtime is allowed in the plan
    if (!plan.allowed_runtimes.includes(runtime)) {
      return res.status(400).json({ error: 'Runtime not allowed in this plan' });
    }

    // Create server in Pelican Panel
    const pelicanServer = await pelicanClient.createServer({
      name,
      userId: targetUserId,
      eggId: 1, // Get from egg templates
      memory: plan.ram,
      disk: plan.disk,
      cpu: plan.cpu * 100 // Convert vCore to percentage
    });

    // Create server record in database
    const server = await Server.create({
      user_id: targetUserId,
      plan_id,
      pelican_server_id: pelicanServer.attributes.id,
      name,
      runtime,
      egg_id: 1,
      egg_name: 'Node.js',
      status: 'active'
    });

    res.status(201).json(server);
  } catch (error) {
    console.error('Create server error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Delete server
exports.deleteServer = async (req, res) => {
  try {
    const { id } = req.params;
    const server = await Server.findByPk(id);

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && server.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete from Pelican Panel
    if (server.pelican_server_id) {
      await pelicanClient.deleteServer(server.pelican_server_id);
    }

    // Delete from database
    await server.destroy();

    res.json({ message: 'Server deleted successfully' });
  } catch (error) {
    console.error('Delete server error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Suspend server (Admin only)
exports.suspendServer = async (req, res) => {
  try {
    const { id } = req.params;
    const server = await Server.findByPk(id);

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Suspend in Pelican Panel
    if (server.pelican_server_id) {
      await pelicanClient.suspendServer(server.pelican_server_id);
    }

    // Update database
    await server.update({ status: 'suspended' });

    res.json({ message: 'Server suspended successfully' });
  } catch (error) {
    console.error('Suspend server error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Unsuspend server (Admin only)
exports.unsuspendServer = async (req, res) => {
  try {
    const { id } = req.params;
    const server = await Server.findByPk(id);

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Unsuspend in Pelican Panel
    if (server.pelican_server_id) {
      await pelicanClient.unsuspendServer(server.pelican_server_id);
    }

    // Update database
    await server.update({ status: 'active' });

    res.json({ message: 'Server unsuspended successfully' });
  } catch (error) {
    console.error('Unsuspend server error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Power actions (restart, stop, kill)
exports.sendPowerAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!['start', 'stop', 'restart', 'kill'].includes(action)) {
      return res.status(400).json({ error: 'Invalid power action' });
    }

    const server = await Server.findByPk(id);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && req.user.role !== 'support' && server.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Send power action to Pelican Panel
    if (server.pelican_server_id) {
      await pelicanClient.sendPowerAction(server.pelican_server_id, action);
    }

    res.json({ message: `Power action '${action}' sent successfully` });
  } catch (error) {
    console.error('Power action error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
