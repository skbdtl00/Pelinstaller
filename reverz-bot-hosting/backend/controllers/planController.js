const { Plan } = require('../models');

// Get all plans (public or all for admin)
exports.getAllPlans = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const where = isAdmin ? {} : { visibility: 'public' };

    const plans = await Plan.findAll({ where });
    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single plan
exports.getPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create plan (Admin only)
exports.createPlan = async (req, res) => {
  try {
    const { name, price, cpu, ram, disk, allowed_runtimes, max_servers, visibility, tags } = req.body;

    if (!name || !price || !cpu || !ram || !disk) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const plan = await Plan.create({
      name,
      price,
      cpu,
      ram,
      disk,
      allowed_runtimes: allowed_runtimes || [],
      max_servers: max_servers || 1,
      visibility: visibility || 'public',
      tags: tags || []
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update plan (Admin only)
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const updates = req.body;
    await plan.update(updates);

    res.json(plan);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete plan (Admin only)
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    await plan.destroy();
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
