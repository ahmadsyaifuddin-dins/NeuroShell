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
      return res.json({ status: 'blocked', message: 'License Key Invalid.' });
    }

    // TIME BOMB CHECK PROTOCOL
    // Cek hanya jika status masih 'active' dan ada dueDate
    if (target.status === 'active' && target.dueDate) {
      const now = new Date();
      const expiryDate = new Date(target.dueDate);

      // Jika HARI INI > JATUH TEMPO
      if (now > expiryDate) {
        target.status = 'blocked'; // TRIGGER KILL SWITCH
        target.message = 'SUBSCRIPTION EXPIRED. PAYMENT REQUIRED.';
        target.autoBlockTriggered = true;
        console.log(`[TIME BOMB] Project ${target.projectName} has expired!`);
      }
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown Device';

    target.lastCheck = new Date();
    target.lastIP = ip ? ip.split(',')[0] : 'Unknown';
    target.deviceInfo = userAgent;
    
    await target.save();

    return res.json({ status: target.status, message: target.message });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server Error' });
  }
}