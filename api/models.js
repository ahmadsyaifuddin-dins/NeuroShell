import mongoose from 'mongoose';

// 1. SCHEMA PROJECT (YANG LAMA)
const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  licenseKey: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  message: { type: String, default: 'License valid.' },
  dueDate: { type: Date, default: null },
  
  // Security & Intel
  clientFingerprint: { type: String, default: null },
  lockToFingerprint: { type: Boolean, default: true },
  backupAppKey: { type: String, default: null },
  lastCheck: { type: Date, default: Date.now },
  lastIP: { type: String, default: null },
  deviceInfo: { type: String, default: null },
  
  // Settings
  autoBlockTriggered: { type: Boolean, default: false },
  cacheDuration: { type: Number, default: 5 }
});

// 2. SCHEMA LOGS (YANG BARU)
const AccessLogSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  ip: String,
  deviceInfo: String,
  status: String, // 'active' atau 'blocked' saat akses terjadi
  timestamp: { type: Date, default: Date.now }
});

// 3. EXPORT MODEL
// Kita gunakan logika: Kalau model sudah ada, pakai yg ada. Kalau belum, buat baru.
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const AccessLog = mongoose.models.AccessLog || mongoose.model('AccessLog', AccessLogSchema);

export { Project, AccessLog };