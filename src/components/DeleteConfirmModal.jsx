import { useState } from 'react';
import { Trash2, AlertTriangle, X, Lock } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        // VERIFIKASI PASSWORD IBU NEGARA
        if (password === 'Masdianah') {
            onConfirm();
            setPassword('');
            setError(false);
        } else {
            setError(true);
            // Efek getar/error
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-neuro-black border border-neuro-red w-full max-w-md rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden relative">

                {/* Header Merah */}
                <div className="bg-neuro-red/10 p-4 border-b border-neuro-red/30 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-neuro-red">
                        <Trash2 size={20} />
                        <h2 className="font-bold font-mono tracking-wider">TERMINATE NODE?</h2>
                    </div>
                    <button onClick={onClose} className="text-neuro-red/60 hover:text-neuro-red transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-neuro-red/20 p-3 rounded-full text-neuro-red">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="text-xs text-gray-400 font-mono leading-relaxed">
                            <p className="mb-2 text-white font-bold">WARNING: IRREVERSIBLE ACTION.</p>
                            <p>This action will permanently delete the project configuration and access logs. To authorize this destruction, enter the administrative password.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="text-[10px] text-neuro-red/60 block mb-2 flex items-center gap-2">
                                <Lock size={12} /> SECURITY OVERRIDE PASSWORD
                            </label>
                            <input
                                type="password"
                                autoFocus
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(false);
                                }}
                                placeholder="Enter password..."
                                className={`w-full bg-black/50 border p-3 text-white focus:outline-none font-mono text-sm rounded transition-all ${error
                                        ? 'border-neuro-red text-neuro-red placeholder-neuro-red/50 animate-pulse'
                                        : 'border-neuro-red/30 focus:border-neuro-red'
                                    }`}
                            />
                            {error && (
                                <p className="text-[10px] text-neuro-red mt-2 font-bold animate-pulse">
                                    ACCESS DENIED: INCORRECT PASSWORD
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-600 text-gray-400 text-xs font-mono hover:bg-gray-800 rounded transition"
                            >
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-neuro-red text-black font-bold text-xs font-mono rounded hover:bg-red-500 transition shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                            >
                                CONFIRM DELETION
                            </button>
                        </div>
                    </form>
                </div>

                {/* Garis Striped ala Hazard */}
                <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_10px,#000_10px,#000_20px)] opacity-20"></div>
            </div>
        </div>
    );
}