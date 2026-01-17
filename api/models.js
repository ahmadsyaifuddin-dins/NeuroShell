import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  licenseKey: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }, 
  message: { type: String, default: 'License valid.' }, 
  lastCheck: { type: Date, default: Date.now }
});

// Cek apakah model sudah ada (biar gak error OverwriteModelError saat hot reload)
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;