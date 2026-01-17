import connectDB from './db_connect.js';
import Project from './models.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDB();
  const { key } = req.query;

  if (!key) return res.status(400).json({ status: 'blocked', message: 'No Key Provided.' });

  try {
    const target = await Project.findOne({ licenseKey: key });
    
    if (!target) {
      return res.json({ status: 'blocked', message: 'License Key Invalid/Not Found.' });
    }

    target.lastCheck = new Date();
    await target.save();

    return res.json({ status: target.status, message: target.message });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server Error' });
  }
}