import { Terminal, RefreshCw, LogOut } from 'lucide-react';

export default function Header({ loading, onRefresh, projectCount, onLogout }) {
    return (
        <header className="max-w-6xl mx-auto border-b border-neuro-green/30 pb-6 mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 border border-neuro-green bg-neuro-green/10 rounded-sm">
                    <Terminal size={32} className="text-neuro-green animate-pulse" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]">
                        NEURO<span className="text-neuro-green">SHELL</span>
                    </h1>
                    <p className="text-xs text-neuro-green/60 tracking-widest">COMMAND CENTER // V.2.2</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-xs text-neuro-green/40 hidden md:block mr-2">NODES: {projectCount}</span>

                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="group flex items-center gap-2 text-xs font-bold border border-neuro-green/30 px-4 py-3 hover:bg-neuro-green hover:text-black transition-all duration-300 disabled:opacity-50 cursor-pointer"
                    title="Sync Database"
                >
                    <RefreshCw size={16} className={`group-hover:rotate-180 transition-transform duration-500 ${loading ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">SYNC</span>
                </button>

                {/* TOMBOL LOGOUT BARU */}
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-xs font-bold border border-neuro-red/30 text-neuro-red px-4 py-3 hover:bg-neuro-red hover:text-white transition-all duration-300 cursor-pointer"
                    title="Lock System"
                >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">LOCK</span>
                </button>
            </div>
        </header>
    );
}