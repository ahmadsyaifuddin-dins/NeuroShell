import { useState, useEffect } from 'react';
import axios from 'axios';
import { Terminal, Activity, ShieldAlert, Plus, Trash2, Power, RefreshCw } from 'lucide-react';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');

  // Ganti URL ini kalau sudah deploy ke Vercel nanti. 
  // Saat local dev, kita harus pakai proxy atau full URL kalau API jalan di port lain.
  // SEMENTARA: Kita asumsikan API jalan di relative path /api/admin
  const API_URL = '/api/admin';

  // Fetch Data
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setProjects(res.data);
    } catch (err) {
      console.error("Gagal konek ke Neural Core (API Error)", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Tambah Project
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName || !newKey) return;

    try {
      await axios.post(API_URL, {
        action: 'create',
        projectName: newName,
        licenseKey: newKey,
        message: 'License Valid. System Operational.'
      });
      setNewName('');
      setNewKey('');
      fetchProjects();
    } catch (err) {
      alert("Error: Key mungkin sudah ada.");
    }
  };

  // Kill Switch Action
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await axios.post(API_URL, {
        action: 'update_status',
        id,
        status: newStatus
      });
      fetchProjects(); // Refresh data
    } catch (err) {
      alert("Gagal mengubah status neural node.");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Putuskan koneksi secara permanen?")) return;
    try {
      await axios.post(API_URL, { action: 'delete', id });
      fetchProjects();
    } catch (err) {
      alert("Gagal menghapus.");
    }
  };

  return (
    <div className="min-h-screen bg-neuro-black p-4 md:p-10 text-neuro-green font-mono selection:bg-neuro-green selection:text-neuro-black">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center border-b border-neuro-green/30 pb-6 mb-10">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <Terminal size={36} className="text-neuro-green animate-pulse" />
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">NEURO<span className="text-white">SHELL</span>_CORE</h1>
            <p className="text-xs text-neuro-green/60">COMMAND CENTER // ADMIN_ACCESS_GRANTED</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchProjects} className="flex items-center gap-2 text-sm border border-neuro-green/30 px-4 py-2 hover:bg-neuro-green/10 transition">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> REFRESH NODE
          </button>
        </div>
      </header>

      {/* INPUT FORM */}
      <div className="mb-12 border border-neuro-green/20 bg-neuro-dark/50 p-6 max-w-2xl mx-auto rounded-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-neuro-green/50"></div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus size={18} /> INJECT NEW NODE</h2>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <input
            value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="PROJECT NAME (e.g. LIZA_PKL)"
            className="bg-black border border-neuro-green/30 p-3 flex-1 text-neuro-green focus:outline-none focus:border-neuro-green placeholder-neuro-green/30"
          />
          <input
            value={newKey} onChange={e => setNewKey(e.target.value)}
            placeholder="LICENSE KEY (UNIQUE)"
            className="bg-black border border-neuro-green/30 p-3 flex-1 text-neuro-green focus:outline-none focus:border-neuro-green placeholder-neuro-green/30"
          />
          <button type="submit" className="bg-neuro-green text-black font-bold px-6 py-3 hover:bg-white transition-colors">
            INJECT
          </button>
        </form>
      </div>

      {/* PROJECT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div key={proj._id} className={`relative border p-6 transition-all duration-300 ${proj.status === 'blocked' ? 'border-neuro-red bg-neuro-red/5' : 'border-neuro-green/30 bg-neuro-dark hover:border-neuro-green'}`}>

            {/* Status Badge */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                {proj.status === 'active' ? (
                  <Activity size={18} className="text-neuro-green animate-pulse" />
                ) : (
                  <ShieldAlert size={18} className="text-neuro-red" />
                )}
                <span className={`text-xs font-bold px-2 py-0.5 border ${proj.status === 'active' ? 'border-neuro-green text-neuro-green' : 'border-neuro-red text-neuro-red'}`}>
                  {proj.status.toUpperCase()}
                </span>
              </div>
              <button onClick={() => handleDelete(proj._id)} className="text-neuro-green/30 hover:text-neuro-red transition">
                <Trash2 size={16} />
              </button>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-1 text-white">{proj.projectName}</h3>
            <p className="text-xs text-neuro-green/50 mb-4 break-all">{proj.licenseKey}</p>

            <div className="text-xs text-gray-500 mb-6 font-mono">
              Last Ping: {new Date(proj.lastCheck).toLocaleString()}
            </div>

            {/* Action Button */}
            <button
              onClick={() => toggleStatus(proj._id, proj.status)}
              className={`w-full flex items-center justify-center gap-2 py-3 font-bold text-sm tracking-wider transition-colors ${proj.status === 'active'
                  ? 'bg-neuro-red/10 text-neuro-red border border-neuro-red hover:bg-neuro-red hover:text-white'
                  : 'bg-neuro-green/10 text-neuro-green border border-neuro-green hover:bg-neuro-green hover:text-black'
                }`}
            >
              <Power size={16} />
              {proj.status === 'active' ? 'TERMINATE (KILL)' : 'RESTORE ACCESS'}
            </button>

          </div>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div className="text-center text-neuro-green/30 mt-20">
          <p>NO ACTIVE NODES DETECTED.</p>
        </div>
      )}

    </div>
  );
}

export default App;