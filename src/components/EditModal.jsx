import { useState } from 'react';
import { Save, X, CalendarClock, MessageSquare, AlertTriangle } from 'lucide-react';

export default function EditModal({ project, onClose, onSave }) {
    const [name, setName] = useState(project.projectName);
    const [key, setKey] = useState(project.licenseKey);
    const [msg, setMsg] = useState(project.message || "License Valid."); // State Message

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const [date, setDate] = useState(formatDate(project.dueDate));

    // --- DAFTAR PRESET PESAN (Ganti sesuka hati) ---
    const PRESETS = [
        { label: "NORMAL", color: "border-neuro-green text-neuro-green", text: "License Valid. System Operational." },
        { label: "MAINTENANCE", color: "border-yellow-500 text-yellow-500", text: "System under maintenance. Please try again later." },
        { label: "TAGIHAN (SOPAN)", color: "border-blue-400 text-blue-400", text: "Masa aktif lisensi telah habis. Silakan hubungi developer untuk perpanjangan." },
        { label: "TAGIHAN (GALAK)", color: "border-neuro-red text-neuro-red", text: "AKSES DITOLAK! SEGERA LUNASI PEMBAYARAN ANDA." },
        { label: "FAKE ERROR", color: "border-gray-400 text-gray-400", text: "Critical System Failure. Error Code: 0x500 Internal Server Error." },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Kirim msg juga
        onSave(project._id, name, key, date, msg);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-neuro-dark border border-neuro-green/50 p-6 rounded-sm w-full max-w-lg shadow-[0_0_50px_rgba(0,255,65,0.2)] mt-10 mb-10">

                <div className="flex justify-between items-center mb-6 border-b border-neuro-green/20 pb-2">
                    <h2 className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
                        <MessageSquare size={20} /> CONFIG NODE
                    </h2>
                    <button onClick={onClose} className="text-neuro-green/50 hover:text-neuro-red transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Baris 1: Nama & Key */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-neuro-green/60 block mb-1">PROJECT ALIAS</label>
                            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/50 border border-neuro-green/30 p-3 text-neuro-green focus:border-neuro-green focus:outline-none text-xs" />
                        </div>
                        <div>
                            <label className="text-[10px] text-neuro-green/60 block mb-1">LICENSE KEY</label>
                            <input value={key} onChange={e => setKey(e.target.value)} className="w-full bg-black/50 border border-neuro-green/30 p-3 text-neuro-green focus:border-neuro-green focus:outline-none text-xs" />
                        </div>
                    </div>

                    {/* Baris 2: Tanggal */}
                    <div>
                        <label className="text-[10px] text-neuro-green/60 block mb-1 flex items-center gap-2">
                            <CalendarClock size={12} /> TIME BOMB (DUE DATE)
                        </label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-black/50 border border-neuro-green/30 p-3 text-neuro-green focus:border-neuro-green focus:outline-none text-xs [color-scheme:dark]" />
                    </div>

                    {/* Baris 3: MESSAGE PRESETS */}
                    <div>
                        <label className="text-[10px] text-neuro-green/60 block mb-2 flex items-center gap-2">
                            <AlertTriangle size={12} /> DISPLAY MESSAGE (CLIENT SIDE)
                        </label>

                        {/* Tombol Preset */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {PRESETS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setMsg(preset.text)}
                                    className={`px-3 py-1 border text-[10px] font-bold rounded hover:bg-white/10 transition ${preset.color}`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        {/* Text Area */}
                        <textarea
                            value={msg}
                            onChange={e => setMsg(e.target.value)}
                            rows={3}
                            className="w-full bg-black/50 border border-neuro-green/30 p-3 text-neuro-green focus:border-neuro-green focus:outline-none text-xs font-mono"
                            placeholder="Custom message for client..."
                        />
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-neuro-green/10">
                        <button type="button" onClick={onClose} className="flex-1 py-3 border border-neuro-green/30 text-neuro-green/60 hover:bg-neuro-green/10 transition font-bold text-xs">CANCEL</button>
                        <button type="submit" className="flex-1 py-3 bg-neuro-green text-black font-bold text-xs hover:bg-white transition flex items-center justify-center gap-2">
                            <Save size={16} /> SAVE CONFIG
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}