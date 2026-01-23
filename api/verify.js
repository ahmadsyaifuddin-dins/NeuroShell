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

    // FINGERPRINT & BACKUP STRATEGY ---
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

    // --- TIME BOMB CHECK ---
    if (target.status === 'active' && target.dueDate) {
      const now = new Date();
      const expiryDate = new Date(target.dueDate);
      if (now > expiryDate) {
        target.status = 'blocked';
        target.message = 'SUBSCRIPTION EXPIRED. PAYMENT REQUIRED.';
        target.autoBlockTriggered = true;
      }
    }

    // --- INTEL CAPTURE (Update Statistik Project) ---
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const rawUserAgent = req.headers['user-agent'] || 'Unknown';
    // Prioritaskan Hardware Info dari PHP ('dv'), kalau kosong baru pakai User-Agent browser
    const hardwareInfo = dv ? dv : rawUserAgent;
    
    // Update data realtime di kartu Project
    target.lastCheck = new Date();
    target.lastIP = ip ? ip.split(',')[0] : 'Unknown';
    target.deviceInfo = hardwareInfo;
    
    // Simpan perubahan status/lastCheck ke database project
    await target.save();


    // SMART LOGGING SYSTEM (ANTI-SPAM FORENSIK)
    try {
        // 1. Ambil Log Terakhir dari Project ini (untuk dibandingkan)
        const lastLog = await AccessLog.findOne({ projectId: target._id }).sort({ timestamp: -1 });

        // 2. Hitung Selisih Waktu & Perubahan
        const now = new Date();
        const lastLogTime = lastLog ? new Date(lastLog.timestamp) : new Date(0); // Kalau gak ada log, set waktu 0
        const diffMinutes = (now - lastLogTime) / 1000 / 60; // Konversi ms ke menit

        // Cek apakah IP berubah dari log terakhir?
        const isIpChanged = lastLog && lastLog.ip !== target.lastIP;
        
        // Cek apakah Status berubah (Active <-> Blocked)?
        const isStatusChanged = lastLog && lastLog.status !== target.status;

        // 3. LOGIC SAKTI:
        // Cuma catat ke database jika salah satu kondisi terpenuhi:
        // A. Belum pernah ada log sama sekali (First Connect)
        // B. IP-nya berubah (Indikasi pindah tempat/wifi)
        // C. Status berubah (Indikasi baru saja diblokir/dibuka)
        // D. Sudah lebih dari 15 menit dari log terakhir (Heartbeat session baru)
        if (!lastLog || isIpChanged || isStatusChanged || diffMinutes > 15) {
            
            await AccessLog.create({
                projectId: target._id,
                ip: target.lastIP,
                deviceInfo: target.deviceInfo,
                status: target.status,
                timestamp: now
            });
            
            console.log(`[LOG] New record created for ${target.projectName}`);
        } else {
            // Jika request terlalu cepat (spam) dari IP yang sama, skip log ini
            // Biar database gak penuh sampah refresh
            // console.log(`[LOG] Skipped (Spam detected/Same session)`);
        }

    } catch (logErr) {
        console.error("Log Error:", logErr);
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