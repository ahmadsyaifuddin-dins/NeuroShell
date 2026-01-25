import connectDB from './db_connect.js';
import { Project, AccessLog } from './models.js';

export default async function handler(req, res) {
  // 1. Konek Database
  await connectDB();

  // 2. GET: Ambil Semua Data
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
    const { action, id, projectName, licenseKey, status, dueDate, message, cacheDuration } = req.body;

    try {
      // ACTION: CREATE
      if (action === 'create') {
        const exists = await Project.findOne({ licenseKey });
        if (exists) {
          return res.status(400).json({ error: 'License Key already exists' });
        }

        const newProject = await Project.create({ 
          projectName, 
          licenseKey, 
          message: 'License Valid. System Operational.',
          dueDate: dueDate ? new Date(dueDate) : null 
        });
        
        return res.status(200).json(newProject);
      }
      
      // ACTION: UPDATE STATUS (Kill Switch)
      if (action === 'update_status') {
        let newMessage = '';
        if (status === 'blocked') {
          newMessage = 'AKSES KE APLIKASI TERBLOKIR. PEMBAYARAN TERTUNDA. HUBUNGI DEVELOPER SEGERA !!!';
        } else {
          newMessage = 'License Valid. System Operational.';
        }

        const updated = await Project.findByIdAndUpdate(id, { 
          status: status,
          message: newMessage,
          autoBlockTriggered: status === 'active' ? false : undefined
        }, { new: true });
        
        return res.status(200).json(updated);
      }

      // ACTION: UPDATE DETAILS (Edit Project & Message)
      if (action === 'update_details') {
        const updated = await Project.findByIdAndUpdate(id, {
          projectName,
          licenseKey,
          dueDate: dueDate ? new Date(dueDate) : null,
          message: message,
          cacheDuration: cacheDuration !== undefined ? parseInt(cacheDuration) : 5
        }, { new: true });

        return res.status(200).json(updated);
      }

      if (action === 'get_logs') {
        // Ambil 10 Log terakhir, urutkan dari yang terbaru
        const logs = await AccessLog.find({ projectId: id })
            .sort({ timestamp: -1 })
            .limit(10);
            
        return res.status(200).json(logs);
      }

      // ACTION: DELETE
      if (action === 'delete') {
        await Project.findByIdAndDelete(id);
        await AccessLog.deleteMany({ projectId: id });
        return res.status(200).json({ success: true });
      }

    } catch (error) {
       console.error("Database Error:", error);
       return res.status(500).json({ error: 'Database Operation Failed' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}