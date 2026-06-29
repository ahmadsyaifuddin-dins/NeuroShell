import { Key, X, Copy, Terminal } from 'lucide-react';

export default function AppKeyModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-neuro-black border border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.15)] rounded-lg max-w-md w-full overflow-hidden relative">

                {/* Garis background grid ala terminal */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                {/* HEADER */}
                <div className="relative bg-yellow-500/10 border-b border-yellow-500/30 p-4 flex justify-between items-center z-10">
                    <h3 className="text-yellow-500 font-bold font-mono flex items-center gap-2 tracking-wider text-sm">
                        <Key size={16} />
                        APP_KEY RECOVERY PROTOCOL
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-yellow-500 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* BODY */}
                <div className="relative p-6 space-y-5 z-10">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Anda akan menyalin <span className="text-yellow-500 font-bold">Original APP_KEY</span> dari target ini. Tindakan ini diperlukan jika Anda ingin memulihkan enkripsi asli dari Laravel.
                    </p>

                    <div className="bg-black/60 border border-gray-800 p-4 rounded font-mono text-xs text-gray-400 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500/50"></div>
                        <div className="flex items-center gap-2 mb-2 text-yellow-500/80">
                            <Terminal size={14} /> <span className="tracking-widest font-bold">INSTRUCTION:</span>
                        </div>
                        <p className="leading-relaxed">
                            Silakan COPY kunci ini dan PASTE ke dalam file <span className="text-white bg-gray-800 px-1 py-0.5 rounded">.env</span> pada project terkait untuk menggantikan nilai <span className="text-yellow-500">APP_KEY=</span> yang saat ini digunakan.
                        </p>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="relative p-4 border-t border-yellow-500/20 flex justify-end gap-3 bg-black/50 z-10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all font-mono text-xs font-bold tracking-widest"
                    >
                        ABORT
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all font-mono text-xs font-bold flex items-center gap-2 tracking-widest"
                    >
                        <Copy size={14} />
                        PROCEED & COPY
                    </button>
                </div>
            </div>
        </div>
    );
}