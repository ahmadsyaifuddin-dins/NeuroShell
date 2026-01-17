import { useState } from 'react';
import { Activity, ShieldAlert, Trash2, Power, Code, Check } from 'lucide-react';

export default function ProjectCard({ proj, onToggle, onDelete, onCopy }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        onCopy(proj.licenseKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isActive = proj.status === 'active';

    return (
        <div className={`group relative border backdrop-blur-sm p-6 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${!isActive
            ? 'border-neuro-red/50 bg-neuro-red/5'
            : 'border-neuro-green/20 bg-neuro-dark/80 hover:border-neuro-green'
            }`}>

            {/* Decorative Corners */}
            <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 transition-opacity ${!isActive ? 'border-neuro-red' : 'border-neuro-green opacity-0 group-hover:opacity-100'}`}></div>
            <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 transition-opacity ${!isActive ? 'border-neuro-red' : 'border-neuro-green opacity-0 group-hover:opacity-100'}`}></div>

            <div>
                {/* Header Kartu */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        {isActive ? (
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neuro-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-neuro-green"></span>
                            </span>
                        ) : (
                            <ShieldAlert size={20} className="text-neuro-red" />
                        )}
                        <span className={`text-xs font-bold tracking-widest ${isActive ? 'text-neuro-green' : 'text-neuro-red'}`}>
                            {proj.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleCopy} className="p-2 hover:bg-neuro-green hover:text-black rounded transition text-neuro-green" title="Copy Config">
                            {copied ? <Check size={16} /> : <Code size={16} />}
                        </button>
                        <button onClick={() => onDelete(proj._id)} className="p-2 hover:bg-neuro-red hover:text-white rounded transition text-neuro-red/60" title="Delete">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Isi Kartu */}
                <h3 className="text-xl font-bold mb-2 text-white truncate">{proj.projectName}</h3>
                <div className="bg-black/60 p-3 rounded border border-white/5 mb-4 font-mono text-[10px] text-neuro-green/60 break-all">
                    KEY_HASH: {proj.licenseKey}
                </div>

                <div className="space-y-2 mb-6 text-[10px] font-mono text-gray-500">

                    {/* Waktu */}
                    <div className="flex items-center gap-2">
                        <Activity size={12} className="text-neuro-green" />
                        <span>LAST SEEN: {proj.lastCheck ? new Date(proj.lastCheck).toLocaleString() : 'NEVER'}</span>
                    </div>

                    {/* IP Address */}
                    <div className="flex items-center gap-2">
                        <span className="text-neuro-red font-bold">IP:</span>
                        <span className="text-gray-400">{proj.lastIP || '-'}</span>
                    </div>

                    {/* Device Info (Truncate biar gak kepanjangan) */}
                    <div className="flex items-start gap-2">
                        <span className="text-neuro-green font-bold">DEV:</span>
                        <span className="text-gray-400 line-clamp-2 leading-tight" title={proj.deviceInfo}>
                            {proj.deviceInfo || '-'}
                        </span>
                    </div>

                </div>

                <div className="text-[10px] text-gray-500 mb-8 font-mono flex items-center gap-2">
                    <Activity size={10} />
                    LAST PING: {proj.lastCheck ? new Date(proj.lastCheck).toLocaleString() : 'NEVER'}
                </div>
            </div>

            {/* Tombol Kill Switch */}
            <button
                onClick={() => onToggle(proj._id, proj.status)}
                className={`w-full cursor-pointer relative overflow-hidden flex items-center justify-center gap-2 py-4 font-bold text-xs tracking-[0.15em] transition-all mt-auto border ${isActive
                    ? 'border-neuro-red/50 text-neuro-red hover:bg-neuro-red hover:text-white'
                    : 'border-neuro-green/50 text-neuro-green hover:bg-neuro-green hover:text-black'
                    }`}
            >
                <Power size={14} />
                {isActive ? 'INITIATE KILL SWITCH' : 'RESTORE ACCESS'}
            </button>
        </div>
    );
}