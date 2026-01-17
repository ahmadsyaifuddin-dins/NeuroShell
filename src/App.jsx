import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Server } from 'lucide-react';

// Import Komponen Modular
import LockScreen from './components/LockScreen';
import Header from './components/Header';
import ProjectForm from './components/ProjectForm';
import ProjectCard from './components/ProjectCard';
import EditModal from './components/EditModal';

function App() {
  // AUTH LOGIC 
  // Cek localStorage saat pertama kali load
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('neuro_access_token') === 'GRANTED';
  });

  // Fungsi Login (Dipanggil dari LockScreen)
  const handleLogin = () => {
    localStorage.setItem('neuro_access_token', 'GRANTED');
    setIsAuthenticated(true);
  };

  // Fungsi Logout (Dipanggil dari Header)
  const handleLogout = () => {
    localStorage.removeItem('neuro_access_token');
    setIsAuthenticated(false);
  };

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const BASE_URL = '/api';
  const ADMIN_URL = `${BASE_URL}/admin`;

  // LOGIC FUNCTIONS 
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(ADMIN_URL);
      if (Array.isArray(res.data)) setProjects(res.data);
      else setProjects([]);
    } catch (err) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const handleAddProject = async (name, key, date) => {
    try {
      await axios.post(ADMIN_URL, {
        action: 'create',
        projectName: name,
        licenseKey: key,
        message: 'License Valid. System Operational.',
        dueDate: date || null
      });
      fetchProjects();
    } catch (err) {
      alert("Error: Key duplicated or Server issue.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await axios.post(ADMIN_URL, { action: 'update_status', id, status: newStatus });
      fetchProjects();
    } catch (err) { alert("Error updating status."); }
  };


  // Handle Save Edit
  const handleUpdateProject = async (id, name, key, date, msg) => {
    try {
      // console.log("Sending Data:", { id, name, key, date, msg }); // Cek data yg dikirim

      await axios.post(ADMIN_URL, {
        action: 'update_details',
        id: id,
        projectName: name,
        licenseKey: key,
        dueDate: date || null,
        message: msg
      });

      setEditingProject(null);
      fetchProjects();
    } catch (err) {
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("CONFIRM DELETION: This node will be permanently removed.")) return;
    try {
      await axios.post(ADMIN_URL, { action: 'delete', id });
      fetchProjects();
    } catch (err) { alert("Error deleting."); }
  };

  const handleCopyConfig = (licenseKey) => {
    const CURRENT_DOMAIN = window.location.origin;
    const fullUrl = `${CURRENT_DOMAIN}/api/verify`;
    const encryptedUrl = btoa(fullUrl);

    const textToCopy = `
// --- [PASTE INI DI PROJECT KLIEN: ${licenseKey}] ---
// URL CONFIG (BASE64):
${encryptedUrl}

// LICENSE KEY:
${licenseKey}
    `;
    navigator.clipboard.writeText(textToCopy);
  };

  // --- RENDER ---

  // 1. Tampilkan Lock Screen jika belum login
  if (!isAuthenticated) {
    // Ubah onUnlock jadi handleLogin
    return <LockScreen onUnlock={handleLogin} />;
  }

  // 2. Tampilkan Dashboard jika sudah login
  return (
    <div className="min-h-screen bg-neuro-black p-4 md:p-8 text-neuro-green font-mono selection:bg-neuro-green selection:text-neuro-black pb-20">

      {/* Pass fungsi Logout ke Header */}
      <Header
        loading={loading}
        onRefresh={fetchProjects}
        projectCount={projects.length}
        onLogout={handleLogout}
      />

      {/* TAMPILKAN MODAL JIKA ADA PROJECT YANG DIEDIT */}
      {editingProject && (
        <EditModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleUpdateProject}
        />
      )}

      <main className="max-w-6xl mx-auto space-y-12">
        <ProjectForm onAdd={handleAddProject} />

        <div className="flex items-center gap-2 text-xs text-neuro-green/40">
          <Server size={14} />
          <span>STATUS: {loading ? "SYNCING..." : "ONLINE"}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && projects.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-neuro-green/20 rounded bg-neuro-green/5 animate-pulse">
              <div className="inline-block p-2 mb-2"><Activity className="animate-spin" /></div>
              <p className="tracking-[0.2em]">ESTABLISHING NEURAL LINK...</p>
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="col-span-full py-20 text-center border border-neuro-green/10 rounded text-neuro-green/40">
              <p>NO ACTIVE NODES DETECTED.</p>
              <p className="text-xs mt-2">Deploy a new target to begin.</p>
            </div>
          )}

          {projects.map((proj) => (
            <ProjectCard
              key={proj._id}
              proj={proj}
              onToggle={handleToggleStatus}
              onDelete={handleDeleteProject}
              onCopy={handleCopyConfig}
              onEdit={(project) => setEditingProject(project)}
            />
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-2 text-center text-[10px] text-neuro-green/20 bg-neuro-black border-t border-neuro-green/10 pointer-events-none">
        SECURE CONNECTION // ENCRYPTED // DEVELOPED BY AHMAD SYAIFUDDIN // NEUROSHELL SYSTEMS INC.
      </footer>
    </div>
  );
}

export default App;