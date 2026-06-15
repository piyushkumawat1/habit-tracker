import { useState, useEffect, useCallback } from 'react';
import { habitsApi, logsApi } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function useHabits() {
  const { isAuthenticated } = useAuth();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) { setLoading(false); return; }
    try {
      const [hRes, lRes] = await Promise.all([habitsApi.getAll(), logsApi.getAll()]);
      setHabits(hRes.data);
      setLogs(lRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { refresh(); }, [refresh]);

  return { habits, logs, loading, refresh };
}
