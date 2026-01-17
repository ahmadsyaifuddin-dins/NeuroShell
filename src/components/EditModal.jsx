import { useState } from 'react';
import { Save, X, CalendarClock } from 'lucide-react';

export default function EditModal({ project, onClose, onSave }) {
    const [name, setName] = useState(project.projectName);
    const [key, setKey] = useState(project.licenseKey);

    // Format tanggal untuk input type="date" (YYYY-MM-DD)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const [date, setDate] = useState(formatDate(project.dueDate));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(project._id, name, key, date);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Gelap */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Box */}
            <div className="relative bg-neuro-dark border border-neuro-green/50 p-6 rounded-sm w-full max-w-md shadow-[0_0_50px_rgba(0,255,65,0.2)] animate-pulse-fast-once">

                <div className="flex justify-between items-center mb-6 border-b border-neuro-green/20 pb-2">
                    <h2 className="text-xl font-bold text-white tracking-widest">EDIT NODE CONFIG</h2>
                    <button onClick={onClose} className="text-neuro-green/50 hover:text-neuro-red transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-neuro-green/60 block mb-1">PROJECT ALIAS</label>
                        <input
                            value={name} onChange={e => setName(e.target.value)}
                            className="w-full bg-black/50 border border-neuro-green/30 p-3 text-neuro-green focus:border-neuro-green focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-neuro-green/60 block mb-1">LICENSE KEY</label>
                        <input
                            value={key} onChange={e => setKey(e.target.value)}
                            className="w-full bg-black/50 border border-neuro-green/30 p-3 text-neuro-green focus:border-neuro-green focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-neuro-green/60 block mb-1 flex items-center gap-2">
                            <CalendarClock size={12} /> TIME BOMB (DUE DATE)
                        </label>
                        <input
                            type="date"
                            value={date} onChange={e => setDate(e.target.value)}
                            className="w-full bg-black/50 border border-neuro-green/30 p-3 text-neuro-green focus:border-neuro-green focus:outline-none [color-scheme:dark]"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">Leave empty to disable auto-kill.</p>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-neuro-green/30 text-neuro-green/60 hover:bg-neuro-green/10 transition font-bold text-xs"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-neuro-green text-black font-bold text-xs hover:bg-white transition flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> SAVE CHANGES
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}