import { useState } from 'react';
import { Save, X, CalendarClock, AlertTriangle, Zap, Hash, KeyRound } from 'lucide-react';
import { formatDateForInput } from '../utils/date';
import { MESSAGE_PRESETS } from '../data/messagePresets';

export default function EditModal({ project, onClose, onSave }) {
    const [name, setName] = useState(project.projectName);
    const [key, setKey] = useState(project.licenseKey);
    const [msg, setMsg] = useState(project.message || "License Valid.");
    const [date, setDate] = useState(formatDateForInput(project.dueDate));
    const [cacheDur, setCacheDur] = useState(project.cacheDuration !== undefined ? project.cacheDuration : 5);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(project._id, name, key, date, msg, cacheDur);
    };

    return (
        // WRAPPER UTAMA: Menangani Scroll di HP
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* CONTAINER FLEX: Mengatur posisi tengah (Desktop) atau scroll (Mobile) */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">

                {/* BACKDROP: Gelap & Blur */}
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                    aria-hidden="true"
                ></div>

                {/* MODAL CARD: Animasi & Styling */}
                <div className="relative transform overflow-hidden rounded-lg bg-neuro-dark border border-neuro-green/30 text-left shadow-[0_0_50px_rgba(0,255,65,0.15)] transition-all sm:my-8 w-full max-w-lg animate-fadeIn">

                    {/* --- HEADER --- */}
                    <div className="bg-neuro-green/5 px-6 py-4 border-b border-neuro-green/20 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white tracking-widest flex items-center gap-2 font-mono">
                            <span className="text-neuro-green">{'>>'}</span> CONFIG_NODE
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-neuro-green/40 hover:text-neuro-red transition duration-200 hover:rotate-90 transform"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* --- BODY FORM --- */}
                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

                        {/* Baris 1: Nama & Key */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="group">
                                <label className="text-[10px] text-neuro-green/70 font-bold mb-1.5 flex items-center gap-1.5">
                                    <Hash size={12} /> PROJECT ALIAS
                                </label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-black/40 border border-neuro-green/20 rounded p-2.5 text-xs text-neuro-green placeholder-neuro-green/20 focus:border-neuro-green focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] focus:outline-none transition-all"
                                    placeholder="ex: Skripsi Nico"
                                />
                            </div>
                            <div className="group">
                                <label className="text-[10px] text-neuro-green/70 font-bold mb-1.5 flex items-center gap-1.5">
                                    <KeyRound size={12} /> LICENSE KEY
                                </label>
                                <input
                                    value={key}
                                    onChange={e => setKey(e.target.value)}
                                    className="w-full bg-black/40 border border-neuro-green/20 rounded p-2.5 text-xs text-neuro-green placeholder-neuro-green/20 focus:border-neuro-green focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] focus:outline-none transition-all font-mono"
                                />
                            </div>
                        </div>

                        {/* Baris 2: Waktu & Cache */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-[10px] text-neuro-green/70 font-bold mb-1.5 flex items-center gap-1.5">
                                    <CalendarClock size={12} /> TIME BOMB (DUE DATE)
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full bg-black/40 border border-neuro-green/20 rounded p-2.5 text-neuro-green focus:border-neuro-green focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] focus:outline-none transition-all text-xs [color-scheme:dark]"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-neuro-green/70 font-bold mb-1.5 flex items-center gap-1.5">
                                    <Zap size={12} /> STEALTH MODE (CACHE)
                                </label>
                                <div className="relative">
                                    <select
                                        value={cacheDur}
                                        onChange={e => setCacheDur(e.target.value)}
                                        className="w-full bg-gray-900 border border-neuro-green/20 rounded p-2.5 text-neuro-green focus:border-neuro-green focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] focus:outline-none text-xs font-mono appearance-none cursor-pointer"
                                    >
                                        <option value="0" className="bg-gray-900 text-neuro-red font-bold">OFF (Realtime - Aggressive)</option>
                                        <option value="3" className="bg-gray-900">3 Minutes</option>
                                        <option value="5" className="bg-gray-900">5 Minutes (Balanced)</option>
                                        <option value="10" className="bg-gray-900">10 Minutes</option>
                                        <option value="15" className="bg-gray-900">15 Minutes</option>
                                        <option value="30" className="bg-gray-900">30 Minutes</option>
                                        <option value="60" className="bg-gray-900 text-indigo-400">1 Hour (Max Performance)</option>
                                    </select>
                                    {/* Custom Arrow */}
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-neuro-green">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Baris 3: Message */}
                        <div className="bg-neuro-green/5 p-3 rounded border border-neuro-green/10">
                            <label className="text-[10px] text-neuro-green/70 font-bold mb-2 flex items-center gap-1.5">
                                <AlertTriangle size={12} /> DISPLAY MESSAGE (CLIENT SIDE)
                            </label>

                            {/* Preset Buttons */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {MESSAGE_PRESETS.map((preset, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setMsg(preset.text)}
                                        className={`px-2 py-1 border text-[10px] font-bold rounded-sm opacity-80 hover:opacity-100 hover:scale-105 transition-all ${preset.color}`}
                                        title={preset.text}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={msg}
                                onChange={e => setMsg(e.target.value)}
                                rows={3}
                                className="w-full bg-black/60 border border-neuro-green/20 rounded p-3 text-neuro-green focus:border-neuro-green focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] focus:outline-none text-xs font-mono placeholder-neuro-green/20"
                                placeholder="Custom message for client..."
                            />
                        </div>

                        {/* --- FOOTER --- */}
                        <div className="flex gap-3 pt-2 mt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition font-bold text-xs tracking-wider"
                            >
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-neuro-green text-black font-bold text-xs rounded hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,65,0.6)] transition-all flex items-center justify-center gap-2 tracking-wider"
                            >
                                <Save size={16} /> SAVE CHANGES
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}