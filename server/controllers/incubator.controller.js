const Incubator = require('../models/Incubator');

// Get all incubators
exports.getAllIncubators = async (req, res) => {
  try {
    const incubators = await Incubator.find();
    res.json(incubators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get incubator by ID
exports.getIncubatorById = async (req, res) => {
  try {
    const incubator = await Incubator.findById(req.params.id);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }
    res.json(incubator);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new incubator
exports.createIncubator = async (req, res) => {
  const incubator = new Incubator({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    logo: req.body.logo,
    website: req.body.website,
    email: req.body.email,
    phone: req.body.phone,
    programs: req.body.programs || [],
    status: req.body.status
  });

  try {
    const newIncubator = await incubator.save();
    res.status(201).json(newIncubator);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update incubator
exports.updateIncubator = async (req, res) => {
  try {
    const incubator = await Incubator.findById(req.params.id);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    Object.assign(incubator, req.body);
    const updatedIncubator = await incubator.save();
    res.json(updatedIncubator);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete incubator
exports.deleteIncubator = async (req, res) => {
  try {
    const incubator = await Incubator.findById(req.params.id);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    await incubator.remove();
    res.json({ message: 'Incubator deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add program to incubator
exports.addProgram = async (req, res) => {
  try {
    const incubator = await Incubator.findById(req.params.id);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    incubator.programs.push(req.body);
    const updatedIncubator = await incubator.save();
    res.json(updatedIncubator);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update program in incubator
exports.updateProgram = async (req, res) => {
  try {
    const incubator = await Incubator.findById(req.params.id);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    const programIndex = incubator.programs.findIndex(
      program => program._id.toString() === req.params.programId
    );

    if (programIndex === -1) {
      return res.status(404).json({ message: 'Program not found' });
    }

    incubator.programs[programIndex] = {
      ...incubator.programs[programIndex],
      ...req.body
    };

    const updatedIncubator = await incubator.save();
    res.json(updatedIncubator);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete program from incubator
exports.deleteProgram = async (req, res) => {
  try {
    const incubator = await Incubator.findById(req.params.id);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    incubator.programs = incubator.programs.filter(
      program => program._id.toString() !== req.params.programId
    );

    const updatedIncubator = await incubator.save();
    res.json(updatedIncubator);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 