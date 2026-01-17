const connectDB = require('./db_connect');
const Project = require('./models');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Penting biar bisa diakses dari mana aja
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();
  const { key } = req.query;

  if (!key) return res.status(400).json({ status: 'blocked', message: 'No Key Provided.' });

  try {
    const target = await Project.findOne({ licenseKey: key });
    
    if (!target) {
      return res.json({ status: 'blocked', message: 'License Key Invalid/Not Found.' });
    }

    // Update waktu terakhir akses (biar kamu tau dia online)
    target.lastCheck = new Date();
    await target.save();

    return res.json({ status: target.status, message: target.message });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server Error' });
  }
};