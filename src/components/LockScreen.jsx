import { useState } from 'react';
import { Lock, Unlock, ChevronRight } from 'lucide-react';

export default function LockScreen({ onUnlock }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // PASSWORD RAHASIA (Ganti sesuai keinginanmu)
        const SECRET_PIN = "1337";

        if (pin === SECRET_PIN) {
            onUnlock();
        } else {
            setError(true);
            setPin('');
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-neuro-black text-neuro-green font-mono z-50 fixed inset-0">
            <div className={`p-8 border border-neuro-green/30 bg-neuro-dark/90 backdrop-blur-md rounded-sm shadow-[0_0_50px_rgba(0,255,65,0.1)] transition-transform duration-100 ${error ? 'translate-x-[-10px]' : ''}`}>
                <div className="flex justify-center mb-6">
                    <div className={`p-4 rounded-full border ${error ? 'border-neuro-red bg-neuro-red/10 text-neuro-red' : 'border-neuro-green bg-neuro-green/10 text-neuro-green'}`}>
                        {error ? <Lock size={32} /> : <Unlock size={32} />}
                    </div>
                </div>

                <h2 className="text-xl font-bold text-center mb-2 tracking-widest text-white">SYSTEM LOCKED</h2>
                <p className="text-xs text-center text-neuro-green/50 mb-6">ENTER SECURITY CLEARANCE CODE</p>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="password"
                        autoFocus
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="bg-black/50 border border-neuro-green/30 p-2 text-center text-xl tracking-[0.5em] text-neuro-green focus:outline-none focus:border-neuro-green w-40"
                        placeholder="****"
                        maxLength={6}
                    />
                    <button type="submit" className="bg-neuro-green text-black p-2 hover:bg-white transition-colors">
                        <ChevronRight size={24} />
                    </button>
                </form>

                {error && (
                    <p className="text-neuro-red text-xs text-center mt-4 animate-pulse">ACCESS DENIED. INVALID CREDENTIALS.</p>
                )}
            </div>
        </div>
    );
}