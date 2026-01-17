const connectDB = require('./db_connect');
const Project = require('./models');

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === 'GET') {
    // Ambil semua data project
    const projects = await Project.find().sort({ lastCheck: -1 });
    return res.json(projects);
  }

  if (req.method === 'POST') {
    const { action, id, projectName, licenseKey, status, message } = req.body;

    // Tambah Project Baru
    if (action === 'create') {
      try {
        const newProject = await Project.create({ projectName, licenseKey, message });
        return res.json(newProject);
      } catch (e) {
        return res.status(400).json({ error: 'Duplicate Key or Error' });
      }
    }
    
    // Matikan/Hidupkan Project (KILL SWITCH)
    if (action === 'update_status') {
      const updated = await Project.findByIdAndUpdate(id, { status }, { new: true });
      return res.json(updated);
    }

    // Hapus Project
    if (action === 'delete') {
      await Project.findByIdAndDelete(id);
      return res.json({ success: true });
    }
  }

  return res.status(405).send('Method Not Allowed');
};