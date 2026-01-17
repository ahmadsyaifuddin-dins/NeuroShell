import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  licenseKey: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }, 
  message: { type: String, default: 'License valid.' }, 
  
  // INTEL DATA
  lastCheck: { type: Date, default: Date.now },
  lastIP: { type: String, default: '-' },       
  deviceInfo: { type: String, default: '-' },

  // TIME BOMB FEATURE
  dueDate: { type: Date, default: null }, // Tanggal Jatuh Tempo (Null = Selamanya)
  autoBlockTriggered: { type: Boolean, default: false } // Penanda kalau dia mati karena bom waktu
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;