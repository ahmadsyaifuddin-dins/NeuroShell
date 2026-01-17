const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  licenseKey: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }, 
  message: { type: String, default: 'License valid.' }, 
  lastCheck: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);