import { X, Activity, HardDrive, Shield, ShieldAlert, Wifi } from 'lucide-react';
import { formatDateTime } from '../utils/date';

export default function LogHistoryModal({ logs, onClose, projectName, isLoading }) {
    if (!logs) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-neuro-black border border-neuro-green/30 w-full max-w-2xl rounded-lg shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="bg-neuro-green/5 p-4 border-b border-neuro-green/20 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2 text-neuro-green">
                        <Activity size={20} />
                        <div>
                            <h2 className="font-bold font-mono tracking-wider text-sm">ACCESS LOGS</h2>
                            <p className="text-[10px] text-gray-500 font-mono">TARGET: {projectName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Content Table */}
                <div className="p-4 overflow-y-auto font-mono text-xs custom-scrollbar">
                    {isLoading ? (
                        <div className="text-center py-10 text-neuro-green animate-pulse">FETCHING DATA STREAMS...</div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-10 text-gray-600">NO ACCESS RECORDS FOUND.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="text-gray-500 border-b border-gray-800 sticky top-0 bg-neuro-black">
                                <tr>
                                    <th className="py-2 pl-2">TIMESTAMP</th>
                                    <th className="py-2">STATUS</th>
                                    <th className="py-2">IP ADDR</th>
                                    <th className="py-2">DEVICE FINGERPRINT</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 pl-2 text-gray-400">
                                            {formatDateTime(log.timestamp)}
                                        </td>
                                        <td className="py-3">
                                            {log.status === 'active' ? (
                                                <span className="flex items-center gap-1 text-neuro-green">
                                                    <Shield size={10} /> ALLOW
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-neuro-red font-bold">
                                                    <ShieldAlert size={10} /> BLOCK
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-gray-300">
                                            <div className="flex items-center gap-1">
                                                <Wifi size={10} className="opacity-50" /> {log.ip || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="py-3 text-gray-300 max-w-[200px] truncate" title={log.deviceInfo}>
                                            <div className="flex items-center gap-1">
                                                <HardDrive size={10} className="opacity-50" />
                                                {log.deviceInfo || 'Unknown Device'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-2 bg-neuro-black border-t border-white/5 text-[10px] text-gray-600 text-center shrink-0">
                    DISPLAYING LAST 50 RECORDS // END OF STREAM
                </div>
            </div>
        </div>
    );
}