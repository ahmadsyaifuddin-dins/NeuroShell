import { useState } from 'react';
import { Plus, CalendarClock, Hash, KeyRound, Zap } from 'lucide-react';

export default function ProjectForm({ onAdd }) {
    const [newName, setNewName] = useState('');
    const [newKey, setNewKey] = useState('');
    const [newDate, setNewDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newName || !newKey) return;
        onAdd(newName, newKey, newDate);
        setNewName('');
        setNewKey('');
        setNewDate('');
    };

    return (
        <section className="relative group animate-fadeIn">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neuro-green via-emerald-500 to-neuro-green rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>

            <div className="relative border border-neuro-green bg-neuro-black p-6 md:p-8 rounded-lg shadow-[0_0_50px_rgba(0,255,65,0.15)] overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-stretch">

                    {/* LABEL / HEADER */}
                    <div className="flex-shrink-0 flex md:flex-col justify-between items-start md:w-32 border-b md:border-b-0 md:border-r border-neuro-green/30 pb-4 md:pb-0 md:pr-4">
                        <div>
                            <h2 className="text-sm font-bold text-white flex items-center gap-2 tracking-widest mb-1">
                                <Plus size={16} className="text-neuro-green" /> INJECT
                            </h2>
                            <h3 className="text-2xl font-black text-neuro-green tracking-tighter">NODE</h3>
                        </div>
                        <div className="hidden md:block text-[10px] text-gray-500 font-mono mt-auto">
                            SYS_V.2.0<br />READY
                        </div>
                    </div>

                    {/* FORM INPUTS */}
                    <form onSubmit={handleSubmit} className="flex-grow flex flex-col md:flex-row gap-4">

                        {/* INPUT 1: NAME */}
                        {/* FIX: Ganti 'flex-[2]' jadi 'w-full md:flex-[2]' */}
                        <div className="w-full md:flex-[2] relative group/input h-14">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neuro-green/50 group-focus-within:text-neuro-green transition-colors">
                                <Hash size={18} />
                            </div>
                            <input
                                value={newName} onChange={e => setNewName(e.target.value)}
                                placeholder="PROJECT ALIAS"
                                className="w-full h-full bg-neuro-green/5 border border-neuro-green/30 rounded pl-12 pr-4 text-neuro-green font-mono text-sm focus:outline-none focus:border-neuro-green focus:bg-neuro-green/10 focus:shadow-[0_0_20px_rgba(0,255,65,0.2)] placeholder-neuro-green/30 transition-all duration-300"
                            />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neuro-green/50 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        </div>

                        {/* INPUT 2: KEY */}
                        {/* FIX: Ganti 'flex-[2]' jadi 'w-full md:flex-[2]' */}
                        <div className="w-full md:flex-[2] relative group/input h-14">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neuro-green/50 group-focus-within:text-neuro-green transition-colors">
                                <KeyRound size={18} />
                            </div>
                            <input
                                value={newKey} onChange={e => setNewKey(e.target.value)}
                                placeholder="LICENSE KEY"
                                className="w-full h-full bg-neuro-green/5 border border-neuro-green/30 rounded pl-12 pr-4 text-neuro-green font-mono text-sm focus:outline-none focus:border-neuro-green focus:bg-neuro-green/10 focus:shadow-[0_0_20px_rgba(0,255,65,0.2)] placeholder-neuro-green/30 transition-all duration-300"
                            />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neuro-green/50 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        </div>

                        {/* INPUT 3: DATE */}
                        {/* FIX: Ganti 'flex-1' jadi 'w-full md:flex-1' */}
                        <div className="w-full md:flex-1 relative group/input min-w-[140px] h-14">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neuro-green/50 group-focus-within:text-neuro-green transition-colors">
                                <CalendarClock size={18} />
                            </div>
                            <input
                                type="date"
                                value={newDate} onChange={e => setNewDate(e.target.value)}
                                className="w-full h-full bg-neuro-green/5 border border-neuro-green/30 rounded pl-12 pr-2 text-neuro-green font-mono text-sm focus:outline-none focus:border-neuro-green focus:bg-neuro-green/10 focus:shadow-[0_0_20px_rgba(0,255,65,0.2)] [color-scheme:dark] transition-all duration-300 cursor-pointer"
                                title="Set Auto-Kill Date"
                            />
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            className="h-14 bg-neuro-green text-black font-black px-6 rounded hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,65,0.6)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                        >
                            <Zap size={20} className="fill-black group-hover:fill-current transition-colors" />
                            <span>INJECT</span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}