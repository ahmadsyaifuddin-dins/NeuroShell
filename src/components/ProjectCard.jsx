import { useState } from 'react';
// Tambahkan ikon 'Monitor' atau 'Laptop' dari lucide-react
import { Activity, ShieldAlert, Trash2, Power, Code, Check, Clock, Pencil, MessageSquare, Key, Monitor, Wifi } from 'lucide-react';
import { formatDateTime } from '../utils/date';

export default function ProjectCard({ proj, onToggle, onDelete, onCopy, onEdit }) {
    const [copied, setCopied] = useState(false);

    const handleCopyBackupKey = () => {
        if (proj.backupAppKey) {
            navigator.clipboard.writeText(proj.backupAppKey);
            alert(`Backup Key Copied:\n${proj.backupAppKey}`);
        } else {
            alert("No backup key saved yet (Waiting for first connection).");
        }
    };

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

                    {/* Action Buttons */}
                    <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={handleCopy} className="p-2 hover:bg-neuro-green hover:text-black rounded transition text-neuro-green" title="Copy Config">
                            {copied ? <Check size={16} /> : <Code size={16} />}
                        </button>

                        {proj.backupAppKey && (
                            <button onClick={handleCopyBackupKey} className="p-2 hover:bg-yellow-500 hover:text-black rounded transition text-yellow-500" title="Copy Original Laravel APP_KEY">
                                <Key size={16} />
                            </button>
                        )}

                        <button onClick={() => onEdit(proj)} className="p-2 hover:bg-blue-500 hover:text-white rounded transition text-blue-400" title="Edit Config">
                            <Pencil size={16} />
                        </button>

                        <button onClick={() => onDelete(proj._id)} className="p-2 hover:bg-neuro-red hover:text-white rounded transition text-neuro-red/60" title="Delete">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Nama Project & Key */}
                <h3 className="text-xl font-bold mb-2 text-white truncate" title={proj.projectName}>{proj.projectName}</h3>
                <div className="bg-black/60 p-3 rounded border border-white/5 mb-4 font-mono text-[10px] text-neuro-green/60 break-all select-all">
                    KEY: {proj.licenseKey}
                </div>

                {/* Info Statistik */}
                <div className="space-y-3 mb-6 text-[10px] font-mono text-gray-500">

                    {/* Waktu Last Seen */}
                    <div className="flex items-center gap-2">
                        <Activity size={12} className="text-neuro-green" />
                        <span>LAST SEEN: {formatDateTime(proj.lastCheck)}</span>
                    </div>

                    {/* IP Address */}
                    <div className="flex items-center gap-2">
                        <Wifi size={12} className="text-neuro-red" />
                        <span className="text-gray-400">{proj.lastIP || 'UNKNOWN'}</span>
                    </div>

                    {/* Device Info (Highlight) */}
                    <div className="flex items-start gap-2 bg-neuro-green/5 p-2 rounded border border-neuro-green/10">
                        <Monitor size={14} className="text-neuro-green mt-[1px]" />
                        <span className="text-neuro-green/80 line-clamp-2 leading-tight break-words uppercase" title={proj.deviceInfo}>
                            {proj.deviceInfo || 'NO DEVICE DATA'}
                        </span>
                    </div>

                    {/* ACTIVE MESSAGE PREVIEW */}
                    <div className="mt-3 pt-3 border-t border-neuro-green/10">
                        <div className="flex items-center gap-2 text-[10px] text-neuro-green/50 mb-1">
                            <MessageSquare size={10} /> <span>ACTIVE MESSAGE:</span>
                        </div>
                        <p className="text-[10px] text-gray-300 italic opacity-80 line-clamp-2 bg-black/30 p-2 rounded border border-white/5">
                            "{proj.message}"
                        </p>
                    </div>

                    {/* TIME BOMB INFO */}
                    {proj.dueDate && proj.status === 'active' && (
                        <div className="mt-2 pt-2 border-t border-neuro-green/20 flex items-center gap-2 text-orange-400 animate-pulse">
                            <Clock size={12} />
                            <span>BOMB: {new Date(proj.dueDate).toLocaleDateString()}</span>
                        </div>
                    )}

                    {/* EXPLODED INFO */}
                    {proj.autoBlockTriggered && proj.status === 'blocked' && (
                        <div className="mt-2 pt-2 border-t border-neuro-red/20 flex items-center gap-2 text-neuro-red">
                            <Clock size={12} />
                            <span>EXPLODED (EXPIRED)</span>
                        </div>
                    )}

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