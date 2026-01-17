import connectDB from './db_connect.js';
import Project from './models.js';

export default async function handler(req, res) {
  // 1. Konek Database
  await connectDB();

  // 2. GET: Ambil Semua Data (Untuk Dashboard)
  if (req.method === 'GET') {
    try {
      const projects = await Project.find().sort({ lastCheck: -1 });
      return res.status(200).json(projects);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  // 3. POST: Aksi (Create, Update, Delete)
  if (req.method === 'POST') {
    // Ambil semua parameter yang mungkin dikirim, termasuk dueDate
    const { action, id, projectName, licenseKey, status, dueDate } = req.body;

    try {
      // ACTION: CREATE (Inject Project Baru)
      if (action === 'create') {
        // Cek duplikat key sederhana
        const exists = await Project.findOne({ licenseKey });
        if (exists) {
          return res.status(400).json({ error: 'License Key already exists' });
        }

        const newProject = await Project.create({ 
          projectName, 
          licenseKey, 
          message: 'License Valid. System Operational.',
          // Simpan tanggal bom waktu (jika ada), kalau tidak ada simpan null
          dueDate: dueDate ? new Date(dueDate) : null 
        });
        
        return res.status(200).json(newProject);
      }
      
      // ACTION: UPDATE STATUS (Kill Switch / Restore)
      if (action === 'update_status') {
        // Logika Ganti Pesan Otomatis
        let newMessage = '';
        
        if (status === 'blocked') {
          // Kalau diblokir, kasih pesan galak
          newMessage = 'ACCESS DENIED. PEMBAYARAN TERTUNDA. HUBUNGI DEVELOPER SEGERA.';
        } else {
          // Kalau diaktifkan kembali, kasih pesan normal
          newMessage = 'License Valid. System Operational.';
        }

        // Update ke Database
        const updated = await Project.findByIdAndUpdate(id, { 
          status: status,
          message: newMessage,
          // Opsional: Reset trigger auto block jika diaktifkan manual
          autoBlockTriggered: status === 'active' ? false : undefined
        }, { new: true });
        
        return res.status(200).json(updated);
      }

      // ACTION: DELETE (Hapus Project)
      if (action === 'delete') {
        await Project.findByIdAndDelete(id);
        return res.status(200).json({ success: true });
      }

    } catch (error) {
       console.error("Database Error:", error);
       // Return error JSON agar frontend tidak hang
       return res.status(500).json({ error: 'Database Operation Failed' });
    }
  }

  // Jika method bukan GET atau POST
  return res.status(405).json({ error: 'Method Not Allowed' });
}