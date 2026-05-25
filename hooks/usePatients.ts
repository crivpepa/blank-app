import { useState, useCallback } from 'react';
import { getPatients } from '../services/patientService';
import { Patient } from '../types';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  }, []);

  return { patients, loading, error, load };
}
