import { useState } from 'react';
import { Plus, CalendarClock } from 'lucide-react'; // Tambah icon CalendarClock

export default function ProjectForm({ onAdd }) {
    const [newName, setNewName] = useState('');
    const [newKey, setNewKey] = useState('');
    const [newDate, setNewDate] = useState(''); // State baru untuk tanggal

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newName || !newKey) return;

        // Kirim tanggal ke App.jsx
        onAdd(newName, newKey, newDate);

        setNewName('');
        setNewKey('');
        setNewDate('');
    };

    return (
        <section className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neuro-green to-neuro-black rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative border border-neuro-green/30 bg-neuro-dark p-6 md:p-8 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]">

                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white border-b border-neuro-green/20 pb-2 inline-block">
                    <Plus size={18} className="text-neuro-green" /> INJECT NEW NODE
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-stretch">
                    <div className="flex-[2] relative">
                        <input
                            value={newName} onChange={e => setNewName(e.target.value)}
                            placeholder="PROJECT ALIAS"
                            className="w-full h-full bg-black/50 border border-neuro-green/30 p-4 text-neuro-green focus:outline-none focus:border-neuro-green placeholder-neuro-green/20"
                        />
                    </div>
                    <div className="flex-[2] relative">
                        <input
                            value={newKey} onChange={e => setNewKey(e.target.value)}
                            placeholder="LICENSE KEY"
                            className="w-full h-full bg-black/50 border border-neuro-green/30 p-4 text-neuro-green focus:outline-none focus:border-neuro-green placeholder-neuro-green/20"
                        />
                    </div>

                    {/* INPUT TANGGAL BARU */}
                    <div className="flex-1 relative group/date">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neuro-green/50 pointer-events-none">
                            <CalendarClock size={18} />
                        </div>
                        <input
                            type="date"
                            value={newDate} onChange={e => setNewDate(e.target.value)}
                            className="w-full h-full bg-black/50 border border-neuro-green/30 p-4 pl-10 text-neuro-green focus:outline-none focus:border-neuro-green text-sm [color-scheme:dark]"
                            title="Set Auto-Kill Date (Optional)"
                        />
                    </div>

                    <button type="submit" className="bg-neuro-green text-black font-bold px-8 py-4 hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(0,255,65,0.4)] cursor-pointer">
                        INJECT
                    </button>
                </form>
            </div>
        </section>
    );
}