import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  licenseKey: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }, 
  message: { type: String, default: 'License valid.' }, 
  
  // --- FITUR INTEL BARU ---
  lastCheck: { type: Date, default: Date.now },
  lastIP: { type: String, default: '-' },       // Menyimpan IP Terakhir
  deviceInfo: { type: String, default: '-' }    // Menyimpan User Agent (Browser/OS)
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;