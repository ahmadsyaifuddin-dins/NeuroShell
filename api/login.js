import connectDB from './db_connect.js';
import { Admin } from './models.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    await connectDB();
    const { username, password } = req.body;

    try {
        // 1. Cari User
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ status: 'error', message: 'Invalid Credentials' });
        }

        // 2. Cek Password (Bandingkan Hash)
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid Credentials' });
        }

        // 3. Login Sukses
        // Kita kirim token sederhana (random string) biar frontend tau login sukses
        const token = "NEURO_SECURE_" + Math.random().toString(36).substr(2) + Date.now();
        
        return res.status(200).json({ status: 'success', token: token });

    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
}