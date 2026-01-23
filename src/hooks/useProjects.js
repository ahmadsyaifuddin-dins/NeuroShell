import { useState, useCallback } from 'react';
import axios from 'axios';

const ADMIN_URL = '/api/admin';

export function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    // Menggunakan useCallback agar fungsi tidak dibuat ulang setiap render
    const fetchProjects = useCallback(async () => {
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
    }, []);

    const addProject = async (name, key, date) => {
        try {
            await axios.post(ADMIN_URL, {
                action: 'create',
                projectName: name,
                licenseKey: key,
                message: 'License Valid. System Operational.',
                dueDate: date || null
            });
            fetchProjects();
            return true;
        } catch (err) {
            alert("Error: Key duplicated or Server issue.");
            return false;
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        try {
            await axios.post(ADMIN_URL, { action: 'update_status', id, status: newStatus });
            fetchProjects();
        } catch (err) {
            alert("Error updating status.");
        }
    };

    const updateProject = async (id, name, key, date, msg, cacheDuration) => {
        try {
            await axios.post(ADMIN_URL, {
                action: 'update_details',
                id, projectName: name, licenseKey: key, dueDate: date || null, message: msg, cacheDuration
            });
            fetchProjects();
            return true;
        } catch (err) {
            return false;
        }
    };

    const deleteProject = async (id) => {
        try {
            await axios.post(ADMIN_URL, { action: 'delete', id });
            fetchProjects();
            return true;
        } catch (err) {
            alert("Error deleting.");
            return false;
        }
    };

    return { 
        projects, 
        loading, 
        fetchProjects, 
        addProject, 
        toggleStatus, 
        updateProject, 
        deleteProject 
    };
}