import { useState, useEffect } from 'react';
import { Activity, Server } from 'lucide-react';

// Import Hooks & Utils Modular
import { useAuth } from './hooks/useAuth';
import { useProjects } from './hooks/useProjects';
import { useLogs } from './hooks/useLogs';
import { copyProjectConfig } from './utils/configGenerator';

// Import Komponen UI
import LockScreen from './components/LockScreen';
import Header from './components/Header';
import ProjectForm from './components/ProjectForm';
import ProjectCard from './components/ProjectCard';
import EditModal from './components/EditModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import LogHistoryModal from './components/LogHistoryModal';

function App() {
  // 1. HOOKS (Logic Data & Auth)
  const { isAuthenticated, login, logout } = useAuth();

  const {
    projects, loading: projectsLoading, fetchProjects,
    addProject, toggleStatus, updateProject, deleteProject
  } = useProjects();

  const { logs, loading: logsLoading, fetchLogs, clearLogs } = useLogs();

  // 2. UI STATE (Hanya untuk kontrol Modal)
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // State Log UI
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logTargetProject, setLogTargetProject] = useState(null);

  // 3. EFFECT
  useEffect(() => {
    if (isAuthenticated) fetchProjects();
  }, [isAuthenticated, fetchProjects]);

  // 4. EVENT HANDLERS (Jembatan antara UI dan Hooks)

  const handleViewLogs = (project) => {
    setLogTargetProject(project);
    setLogModalOpen(true);
    fetchLogs(project._id);
  };

  const closeLogModal = () => {
    setLogModalOpen(false);
    setLogTargetProject(null);
    clearLogs();
  };

  const handleExecuteDelete = async () => {
    const success = await deleteProject(deleteTargetId);
    if (success) setDeleteTargetId(null);
  };

  const handleSaveEdit = async (id, name, key, date, msg, cacheDur) => {
    const success = await updateProject(id, name, key, date, msg, cacheDur);
    if (success) setEditingProject(null);
  };

  // --- RENDER VIEW ---

  if (!isAuthenticated) return <LockScreen onUnlock={login} />;

  return (
    <div className="min-h-screen bg-neuro-black p-4 md:p-8 text-neuro-green font-mono selection:bg-neuro-green selection:text-neuro-black pb-20">

      <Header
        loading={projectsLoading}
        onRefresh={fetchProjects}
        projectCount={projects.length}
        onLogout={logout}
      />

      {/* --- MODALS --- */}

      {editingProject && (
        <EditModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSaveEdit}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleExecuteDelete}
      />

      {logModalOpen && (
        <LogHistoryModal
          logs={logs}
          projectName={logTargetProject?.projectName}
          isLoading={logsLoading}
          onClose={closeLogModal}
        />
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-6xl mx-auto space-y-12">
        <ProjectForm onAdd={addProject} />

        <div className="flex items-center gap-2 text-xs text-neuro-green/40">
          <Server size={14} />
          <span>STATUS: {projectsLoading ? "SYNCING..." : "ONLINE"}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsLoading && projects.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-neuro-green/20 rounded bg-neuro-green/5 animate-pulse">
              <div className="inline-block p-2 mb-2"><Activity className="animate-spin" /></div>
              <p className="tracking-[0.2em]">ESTABLISHING NEURAL LINK...</p>
            </div>
          )}

          {!projectsLoading && projects.length === 0 && (
            <div className="col-span-full py-20 text-center border border-neuro-green/10 rounded text-neuro-green/40">
              <p>NO ACTIVE NODES DETECTED.</p>
              <p className="text-xs mt-2">Deploy a new target to begin.</p>
            </div>
          )}

          {projects.map((proj) => (
            <ProjectCard
              key={proj._id}
              proj={proj}
              onToggle={toggleStatus}
              onDelete={(id) => setDeleteTargetId(id)}
              onCopy={copyProjectConfig}
              onEdit={(project) => setEditingProject(project)}
              onViewLogs={handleViewLogs}
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