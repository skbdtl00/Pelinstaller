const { ApiConfig, EggTemplate } = require('../models');

// Get API configuration (Admin only)
exports.getConfig = async (req, res) => {
  try {
    const config = await ApiConfig.findOne();
    
    if (!config) {
      return res.status(404).json({ error: 'API configuration not found' });
    }

    // Don't expose the full API key
    const safeConfig = {
      id: config.id,
      pelican_base_url: config.pelican_base_url,
      pelican_api_key: config.pelican_api_key.substring(0, 10) + '...',
      default_node_id: config.default_node_id,
      queue_delay: config.queue_delay,
      webhook_url: config.webhook_url
    };

    res.json(safeConfig);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update API configuration (Admin only)
exports.updateConfig = async (req, res) => {
  try {
    let config = await ApiConfig.findOne();

    if (!config) {
      config = await ApiConfig.create(req.body);
    } else {
      await config.update(req.body);
    }

    res.json({ message: 'API configuration updated successfully' });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all egg templates (Admin only)
exports.getEggTemplates = async (req, res) => {
  try {
    const templates = await EggTemplate.findAll();
    res.json(templates);
  } catch (error) {
    console.error('Get egg templates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create egg template (Admin only)
exports.createEggTemplate = async (req, res) => {
  try {
    const { runtime_name, egg_id, egg_name, description } = req.body;

    if (!runtime_name || !egg_id || !egg_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const template = await EggTemplate.create({
      runtime_name,
      egg_id,
      egg_name,
      description
    });

    res.status(201).json(template);
  } catch (error) {
    console.error('Create egg template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update egg template (Admin only)
exports.updateEggTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await EggTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ error: 'Egg template not found' });
    }

    await template.update(req.body);
    res.json(template);
  } catch (error) {
    console.error('Update egg template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete egg template (Admin only)
exports.deleteEggTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await EggTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ error: 'Egg template not found' });
    }

    await template.destroy();
    res.json({ message: 'Egg template deleted successfully' });
  } catch (error) {
    console.error('Delete egg template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
