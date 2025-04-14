const Startup = require('../models/Startup');
const Incubator = require('../models/Incubator');

// Get all startups
exports.getAllStartups = async (req, res) => {
  try {
    const startups = await Startup.find()
      .populate('applications.incubator')
      .populate('applications.program');
    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get startup by ID
exports.getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .populate('applications.incubator')
      .populate('applications.program');
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new startup
exports.createStartup = async (req, res) => {
  const startup = new Startup({
    name: req.body.name,
    description: req.body.description,
    logo: req.body.logo,
    website: req.body.website,
    email: req.body.email,
    phone: req.body.phone,
    industry: req.body.industry,
    stage: req.body.stage,
    foundingDate: req.body.foundingDate,
    teamSize: req.body.teamSize
  });

  try {
    const newStartup = await startup.save();
    res.status(201).json(newStartup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update startup
exports.updateStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    Object.assign(startup, req.body);
    const updatedStartup = await startup.save();
    res.json(updatedStartup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete startup
exports.deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    await startup.remove();
    res.json({ message: 'Startup deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply to incubator program
exports.applyToProgram = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    const incubator = await Incubator.findById(req.body.incubatorId);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    const program = incubator.programs.id(req.body.programId);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    startup.applications.push({
      incubator: req.body.incubatorId,
      program: req.body.programId,
      fundingRequired: req.body.fundingRequired,
      productDescription: req.body.productDescription,
      impact: req.body.impact
    });

    const updatedStartup = await startup.save();
    res.json(updatedStartup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get startup applications
exports.getApplications = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .populate('applications.incubator')
      .populate('applications.program');
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }
    res.json(startup.applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    const application = startup.applications.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = req.body.status;
    const updatedStartup = await startup.save();
    res.json(updatedStartup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 