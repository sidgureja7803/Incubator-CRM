const Infrastructure = require('../models/Infrastructure');

// Get all infrastructure
exports.getAllInfrastructure = async (req, res) => {
  try {
    const infrastructure = await Infrastructure.find();
    res.json(infrastructure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get infrastructure by ID
exports.getInfrastructureById = async (req, res) => {
  try {
    const infrastructure = await Infrastructure.findById(req.params.id);
    if (!infrastructure) {
      return res.status(404).json({ message: 'Infrastructure not found' });
    }
    res.json(infrastructure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new infrastructure
exports.createInfrastructure = async (req, res) => {
  const infrastructure = new Infrastructure({
    incubatorName: req.body.incubatorName,
    infraId: req.body.infraId,
    infraType: req.body.infraType,
    infraCapacity: req.body.infraCapacity,
    incubatorId: req.body.incubatorId
  });

  try {
    const newInfrastructure = await infrastructure.save();
    res.status(201).json(newInfrastructure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update infrastructure
exports.updateInfrastructure = async (req, res) => {
  try {
    const infrastructure = await Infrastructure.findById(req.params.id);
    if (!infrastructure) {
      return res.status(404).json({ message: 'Infrastructure not found' });
    }

    Object.assign(infrastructure, req.body);
    const updatedInfrastructure = await infrastructure.save();
    res.json(updatedInfrastructure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete infrastructure
exports.deleteInfrastructure = async (req, res) => {
  try {
    const infrastructure = await Infrastructure.findById(req.params.id);
    if (!infrastructure) {
      return res.status(404).json({ message: 'Infrastructure not found' });
    }

    await infrastructure.remove();
    res.json({ message: 'Infrastructure deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 