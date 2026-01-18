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

  // TIME BOMB
  dueDate: { type: Date, default: null },
  autoBlockTriggered: { type: Boolean, default: false },

  // Menyimpan hash dari APP_KEY laravel korban
  clientFingerprint: { type: String, default: null }, 
  // Jika true, maka jika fingerprint berubah, otomatis blokir
  lockToFingerprint: { type: Boolean, default: true } 
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;