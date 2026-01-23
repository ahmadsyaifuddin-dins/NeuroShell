import connectDB from './db_connect.js';
import { Project, AccessLog } from './models.js';

export default async function handler(req, res) {
  // 1. Konek Database
  await connectDB();

  // 2. Ambil Parameter dari Request
  const { key, hash, ak, dv } = req.query; 

  // Validasi Dasar
  if (!key) {
    return res.status(400).json({ status: 'error', message: 'No License Key' });
  }

  try {
    // Cari Project Berdasarkan License Key
    const target = await Project.findOne({ licenseKey: key });
    
    // Jika tidak ketemu -> Blokir
    if (!target) {
      return res.json({ status: 'blocked', message: 'License Key Invalid.' });
    }

    // FINGERPRINT & BACKUP STRATEGY
    if (hash) {
      // A. KONEKSI PERTAMA (Simpan Fingerprint jika belum ada)
      if (!target.clientFingerprint) {
        target.clientFingerprint = hash;
        console.log(`[SECURITY] Project ${target.projectName} LOCKED to fingerprint: ${hash}`);
      } 
      // B. VALIDASI (Jika sudah ada, cek kecocokan)
      else if (target.lockToFingerprint && target.clientFingerprint !== hash) {
        target.status = 'blocked';
        target.message = 'SECURITY VIOLATION: APPLICATION KEY MISMATCH. SYSTEM LOCKED.';
        console.log(`[ALERT] Fingerprint Mismatch for ${target.projectName}! Blocked.`);
      }

      // C. SIMPAN BACKUP KEY (Logika Independen)
      // Simpan Key Asli jika di database belum ada, tapi client mengirimkannya
      if (!target.backupAppKey && ak) {
         target.backupAppKey = ak;
         console.log(`[BACKUP] Original Key saved for ${target.projectName}`);
      }
    }

    // TIME BOMB CHECK
    if (target.status === 'active' && target.dueDate) {
      const now = new Date();
      const expiryDate = new Date(target.dueDate);
      if (now > expiryDate) {
        target.status = 'blocked';
        target.message = 'SUBSCRIPTION EXPIRED. PAYMENT REQUIRED.';
        target.autoBlockTriggered = true;
      }
    }

    // INTEL CAPTURE (Update Statistik)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const rawUserAgent = req.headers['user-agent'] || 'Unknown';
    const hardwareInfo = dv ? dv : rawUserAgent;
    
    target.lastCheck = new Date();
    target.lastIP = ip ? ip.split(',')[0] : 'Unknown';
    target.deviceInfo = hardwareInfo;
    
    // Simpan perubahan ke database
    await target.save();

    // REKAM JEJAK LOG (FORENSIK)
    try {
        await AccessLog.create({
            projectId: target._id,
            ip: target.lastIP,
            deviceInfo: target.deviceInfo,
            status: target.status, // Status saat itu (Active/Blocked)
            timestamp: new Date()
        });
    } catch (logErr) {
        console.error("Log Error:", logErr); // Jangan sampai error log bikin aplikasi mati
    }

    // RESPONSE KE CLIENT
    const durationMinutes = target.cacheDuration !== undefined ? target.cacheDuration : 5;

    return res.json({ 
        status: target.status, 
        message: target.message, 
        // Konversi menit ke detik untuk Laravel
        cache_ttl: durationMinutes * 60 
    });

  } catch (error) {
    console.error("Verify API Error:", error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}