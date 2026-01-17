import connectDB from './db_connect.js'; // Pakai .js di akhir!
import Project from './models.js';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const projects = await Project.find().sort({ lastCheck: -1 });
    return res.status(200).json(projects);
  }

  if (req.method === 'POST') {
    const { action, id, projectName, licenseKey, status } = req.body;

    try {
      if (action === 'create') {
        const newProject = await Project.create({ 
          projectName, 
          licenseKey, 
          message: 'License Valid. System Operational.' 
        });
        return res.status(200).json(newProject);
      }
      
      if (action === 'update_status') {
        const updated = await Project.findByIdAndUpdate(id, { status }, { new: true });
        return res.status(200).json(updated);
      }

      if (action === 'delete') {
        await Project.findByIdAndDelete(id);
        return res.status(200).json({ success: true });
      }
    } catch (error) {
       console.error(error);
       return res.status(500).json({ error: 'Database Operation Failed' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}