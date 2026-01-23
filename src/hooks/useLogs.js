import { useState } from 'react';
import axios from 'axios';

const ADMIN_URL = '/api/admin';

export function useLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async (projectId) => {
        setLoading(true);
        try {
            const res = await axios.post(ADMIN_URL, {
                action: 'get_logs',
                id: projectId
            });
            if (Array.isArray(res.data)) {
                setLogs(res.data);
            } else {
                setLogs([]);
            }
        } catch (err) {
            console.error("Failed to fetch logs");
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const clearLogs = () => setLogs([]);

    return { logs, loading, fetchLogs, clearLogs };
}