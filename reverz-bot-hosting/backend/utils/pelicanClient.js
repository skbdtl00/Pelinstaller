const axios = require('axios');
const { ApiConfig } = require('../models');

class PelicanClient {
  constructor() {
    this.baseUrl = null;
    this.apiKey = null;
    this.defaultNodeId = null;
  }

  async initialize() {
    const config = await ApiConfig.findOne();
    if (config) {
      this.baseUrl = config.pelican_base_url;
      this.apiKey = config.pelican_api_key;
      this.defaultNodeId = config.default_node_id;
    }
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Create a new server in Pelican Panel
  async createServer({ name, userId, eggId, memory, disk, cpu }) {
    await this.initialize();
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/application/servers`,
        {
          name,
          user: userId,
          egg: eggId,
          docker_image: 'ghcr.io/pelican-dev/yolks:nodejs_18',
          startup: 'npm start',
          environment: {},
          limits: {
            memory,
            swap: 0,
            disk,
            io: 500,
            cpu
          },
          feature_limits: {
            databases: 0,
            backups: 0,
            allocations: 1
          },
          allocation: {
            default: null
          }
        },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating server in Pelican:', error.response?.data || error.message);
      throw new Error('Failed to create server in Pelican Panel');
    }
  }

  // Delete a server from Pelican Panel
  async deleteServer(serverId) {
    await this.initialize();
    
    try {
      await axios.delete(
        `${this.baseUrl}/api/application/servers/${serverId}`,
        { headers: this.getHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Error deleting server from Pelican:', error.response?.data || error.message);
      throw new Error('Failed to delete server from Pelican Panel');
    }
  }

  // Suspend a server in Pelican Panel
  async suspendServer(serverId) {
    await this.initialize();
    
    try {
      await axios.post(
        `${this.baseUrl}/api/application/servers/${serverId}/suspend`,
        {},
        { headers: this.getHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Error suspending server in Pelican:', error.response?.data || error.message);
      throw new Error('Failed to suspend server in Pelican Panel');
    }
  }

  // Unsuspend a server in Pelican Panel
  async unsuspendServer(serverId) {
    await this.initialize();
    
    try {
      await axios.post(
        `${this.baseUrl}/api/application/servers/${serverId}/unsuspend`,
        {},
        { headers: this.getHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Error unsuspending server in Pelican:', error.response?.data || error.message);
      throw new Error('Failed to unsuspend server in Pelican Panel');
    }
  }

  // Get server details from Pelican Panel
  async getServer(serverId) {
    await this.initialize();
    
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/application/servers/${serverId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching server from Pelican:', error.response?.data || error.message);
      throw new Error('Failed to fetch server from Pelican Panel');
    }
  }

  // Update server resources
  async updateServerResources(serverId, { memory, disk, cpu }) {
    await this.initialize();
    
    try {
      const response = await axios.patch(
        `${this.baseUrl}/api/application/servers/${serverId}/build`,
        {
          limits: {
            memory,
            disk,
            cpu
          }
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating server resources:', error.response?.data || error.message);
      throw new Error('Failed to update server resources');
    }
  }

  // Send power action to server
  async sendPowerAction(serverId, action) {
    await this.initialize();
    
    try {
      await axios.post(
        `${this.baseUrl}/api/client/servers/${serverId}/power`,
        { signal: action },
        { headers: this.getHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Error sending power action:', error.response?.data || error.message);
      throw new Error('Failed to send power action');
    }
  }
}

module.exports = new PelicanClient();
