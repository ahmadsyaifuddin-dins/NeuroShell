import { useState } from 'react';
import { Lock, Fingerprint, User, Key, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function LockScreen({ onUnlock }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Panggil API Login
            const res = await axios.post('/api/login', { username, password });

            if (res.data.status === 'success') {
                // Simpan token yang dikasih server
                localStorage.setItem('neuro_session', res.data.token);
                onUnlock(); // Buka Dashboard
            }
        } catch (err) {
            setError('ACCESS DENIED: Invalid Credentials');
            setPassword(''); // Reset password biar ngetik ulang
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-neuro-black flex items-center justify-center p-4 z-[9999]">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neuro-green/5 via-neuro-black to-neuro-black pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-neuro-green shadow-[0_0_20px_#00ff41]"></div>

            <div className="w-full max-w-sm relative">
                {/* Header Logo */}
                <div className="text-center mb-8 animate-pulse">
                    <div className="inline-block p-4 rounded-full border border-neuro-green/30 bg-neuro-green/5 mb-4 shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                        <Fingerprint size={48} className="text-neuro-green" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-[0.2em] font-mono">NEURO<span className="text-neuro-green">SHELL</span></h1>
                    <p className="text-[10px] text-neuro-green/50 tracking-widest mt-2">SECURE ACCESS GATEWAY v2.0</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4 relative z-10">

                    {/* Error Message */}
                    {error && (
                        <div className="bg-neuro-red/10 border border-neuro-red/50 p-3 rounded flex items-center gap-2 text-neuro-red text-xs font-bold animate-pulse">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    {/* Username Input */}
                    <div className="group relative">
                        <div className="absolute left-3 top-3 text-neuro-green/50 group-focus-within:text-neuro-green transition-colors">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="OPERATOR ID"
                            className="w-full bg-black/40 border border-neuro-green/20 rounded py-3 pl-10 pr-4 text-neuro-green placeholder-neuro-green/20 focus:outline-none focus:border-neuro-green focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all text-sm font-mono tracking-wider"
                            autoComplete="off"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="group relative">
                        <div className="absolute left-3 top-3 text-neuro-green/50 group-focus-within:text-neuro-green transition-colors">
                            <Key size={18} />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="ACCESS CODE"
                            className="w-full bg-black/40 border border-neuro-green/20 rounded py-3 pl-10 pr-4 text-neuro-green placeholder-neuro-green/20 focus:outline-none focus:border-neuro-green focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all text-sm font-mono tracking-wider"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-neuro-green text-black font-bold py-3 rounded hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,65,0.5)] transition-all duration-300 flex items-center justify-center gap-2 tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
                        {!loading && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                {/* Footer Info */}
                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-[10px] text-neuro-green/30 font-mono">
                        <Lock size={10} />
                        <span>ENCRYPTED CONNECTION // SHA-256</span>
                    </div>
                </div>
            </div>
        </div>
    );
}