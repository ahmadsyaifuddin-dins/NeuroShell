import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function ProjectForm({ onAdd }) {
    const [newName, setNewName] = useState('');
    const [newKey, setNewKey] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newName || !newKey) return;
        onAdd(newName, newKey);
        setNewName('');
        setNewKey('');
    };

    return (
        <section className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neuro-green to-neuro-black rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative border border-neuro-green/30 bg-neuro-dark p-6 md:p-8 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]">

                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white border-b border-neuro-green/20 pb-2 inline-block">
                    <Plus size={18} className="text-neuro-green" /> INJECT NEW NODE
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            value={newName} onChange={e => setNewName(e.target.value)}
                            placeholder="PROJECT ALIAS (e.g. SMAN 3)"
                            className="w-full bg-black/50 border border-neuro-green/30 p-4 text-neuro-green focus:outline-none focus:border-neuro-green focus:ring-1 focus:ring-neuro-green transition-all placeholder-neuro-green/20"
                        />
                    </div>
                    <div className="flex-1 relative">
                        <input
                            value={newKey} onChange={e => setNewKey(e.target.value)}
                            placeholder="LICENSE KEY (UNIQUE)"
                            className="w-full bg-black/50 border border-neuro-green/30 p-4 text-neuro-green focus:outline-none focus:border-neuro-green focus:ring-1 focus:ring-neuro-green transition-all placeholder-neuro-green/20"
                        />
                    </div>
                    <button type="submit" className="bg-neuro-green text-black font-bold px-8 py-4 hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,65,0.4)] cursor-pointer">
                        INJECT
                    </button>
                </form>
            </div>
        </section>
    );
}