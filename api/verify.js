import connectDB from './db_connect.js';
import Project from './models.js';

export default async function handler(req, res) {
  await connectDB();

  const { key, hash, ak} = req.query; // Kita terima parameter 'hash' (dari Trait PHP tadi)

  if (!key) {
    return res.status(400).json({ status: 'error', message: 'No License Key' });
  }

  try {
    const target = await Project.findOne({ licenseKey: key });
    
    if (!target) {
      return res.json({ status: 'blocked', message: 'License Key Invalid.' });
    }

    // FINGERPRINT & BACKUP STRATEGY
    if (hash) {
      // 1. KONEKSI PERTAMA (Simpan Fingerprint jika belum ada)
      if (!target.clientFingerprint) {
        target.clientFingerprint = hash;
        console.log(`[SECURITY] Project ${target.projectName} LOCKED to fingerprint: ${hash}`);
      } 
      // 2. VALIDASI (Jika sudah ada, cek kecocokan)
      else if (target.lockToFingerprint && target.clientFingerprint !== hash) {
        target.status = 'blocked';
        target.message = 'SECURITY VIOLATION: APPLICATION KEY MISMATCH. SYSTEM LOCKED.';
      }

      // 3. SIMPAN BACKUP KEY (Logika Baru: Cek Independen)
      // Jika backup key belum ada DI DB, dan ada kiriman 'ak' dari client -> SIMPAN
      if (!target.backupAppKey && ak) {
         target.backupAppKey = ak;
         console.log(`[BACKUP] Original Key saved for ${target.projectName}`);
      }
    }

    // TIME BOMB CHECK (Logic Lama)
    if (target.status === 'active' && target.dueDate) {
      const now = new Date();
      const expiryDate = new Date(target.dueDate);
      if (now > expiryDate) {
        target.status = 'blocked';
        target.message = 'SUBSCRIPTION EXPIRED. PAYMENT REQUIRED.';
        target.autoBlockTriggered = true;
      }
    }

    // INTEL CAPTURE (Logic Lama)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown Device';

    target.lastCheck = new Date();
    target.lastIP = ip ? ip.split(',')[0] : 'Unknown';
    target.deviceInfo = userAgent;
    
    await target.save();

    return res.json({ status: target.status, message: target.message, cache_ttl: (target.cacheDuration || 5) * 60 });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error' });
  }
}