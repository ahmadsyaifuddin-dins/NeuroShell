import { useState } from 'react';
import { Save, X, CalendarClock, MessageSquare, AlertTriangle, Zap } from 'lucide-react';
import { formatDateForInput } from '../utils/date';
import { MESSAGE_PRESETS } from '../data/messagePresets';

export default function EditModal({ project, onClose, onSave }) {
    const [name, setName] = useState(project.projectName);
    const [key, setKey] = useState(project.licenseKey);
    const [msg, setMsg] = useState(project.message || "License Valid."); // State Message

    const [date, setDate] = useState(formatDateForInput(project.dueDate));

    const [cacheDur, setCacheDur] = useState(project.cacheDuration !== undefined ? project.cacheDuration : 5);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(project._id, name, key, date, msg, cacheDur);
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

                    {/* INPUT CACHE DURATION */}
                    <div>
                        <label className="text-[10px] text-neuro-green/60 block mb-1 flex items-center gap-2">
                            <Zap size={12} /> STEALTH MODE (CACHE)
                        </label>
                        <select
                            value={cacheDur}
                            onChange={e => setCacheDur(e.target.value)}
                            className="w-full bg-slate-950 border border-neuro-green/30 p-2 text-neuro-green focus:border-neuro-green focus:outline-none text-xs font-mono rounded"
                        >
                            <option value="0" className='text-red-600'>OFF (Realtime - Aggressive)</option>
                            <option value="5">5 Minutes (Balanced)</option>
                            <option value="10">10 Minutes</option>
                            <option value="15">15 Minutes</option>
                            <option value="30">30 Minutes</option>
                            <option value="60" className='text-indigo-600'>1 Hour (Max Performance)</option>
                        </select>
                    </div>

                    {/* Baris 3: MESSAGE PRESETS */}
                    <div>
                        <label className="text-[10px] text-neuro-green/60 block mb-2 flex items-center gap-2">
                            <AlertTriangle size={12} /> DISPLAY MESSAGE (CLIENT SIDE)
                        </label>

                        {/* Tombol Preset (Looping data dari import) */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {MESSAGE_PRESETS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setMsg(preset.text)}
                                    className={`px-3 py-1 border text-[10px] font-bold rounded hover:bg-white/10 transition ${preset.color}`}
                                    title={preset.text} // Biar user bisa hover buat liat isi pesannya
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
                            className="w-full bg-black/50 border border-neuro-green/30 p-3 text-neuro-green focus:border-neuro-green focus:outline-none text-xs font-mono placeholder-neuro-green/20"
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
            </div >
        </div >
    );
}