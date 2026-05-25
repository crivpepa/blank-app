import { useState, useCallback } from 'react';
import { getAppointments } from '../services/appointmentService';
import { Appointment } from '../types';

export function useAppointments(patientId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments(patientId);
      setAppointments(data);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar citas');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  return { appointments, loading, error, load };
}
