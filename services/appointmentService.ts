import { db } from './firebase';
import { Appointment } from '../types';

const isFirebaseConfigured = (): boolean => {
  try {
    return !!(db && db.app && db.app.options.apiKey !== 'YOUR_API_KEY');
  } catch {
    return false;
  }
};

const today = new Date();
const fmt = (d: Date): string => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number): Date => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'a001',
    patientId: 'p001',
    patientName: 'Carlos Mendoza García',
    doctorName: 'Dr. Ramírez',
    date: fmt(today),
    time: '09:00',
    type: 'Fisioterapia',
    status: 'Confirmada',
    notes: 'Continuar con ejercicios de rodilla',
  },
  {
    id: 'a002',
    patientId: 'p002',
    patientName: 'María López Herrera',
    doctorName: 'Dra. Gutiérrez',
    date: fmt(today),
    time: '10:30',
    type: 'Seguimiento',
    status: 'Confirmada',
    notes: 'Revisar avance de movilidad',
  },
  {
    id: 'a003',
    patientId: 'p004',
    patientName: 'Ana Torres Vega',
    doctorName: 'Dra. Flores',
    date: fmt(addDays(today, 1)),
    time: '08:00',
    type: 'Evaluación',
    status: 'Pendiente',
    notes: 'Primera evaluación mensual',
  },
  {
    id: 'a004',
    patientId: 'p005',
    patientName: 'Luis Martínez Ruiz',
    doctorName: 'Dr. Ramírez',
    date: fmt(addDays(today, 1)),
    time: '11:00',
    type: 'Fisioterapia',
    status: 'Confirmada',
    notes: 'Ultrasonido terapéutico',
  },
  {
    id: 'a005',
    patientId: 'p001',
    patientName: 'Carlos Mendoza García',
    doctorName: 'Dr. Ramírez',
    date: fmt(addDays(today, 2)),
    time: '09:00',
    type: 'Fisioterapia',
    status: 'Pendiente',
    notes: '',
  },
  {
    id: 'a006',
    patientId: 'p002',
    patientName: 'María López Herrera',
    doctorName: 'Dra. Gutiérrez',
    date: fmt(addDays(today, 3)),
    time: '14:00',
    type: 'Seguimiento',
    status: 'Pendiente',
    notes: 'Evaluación de resultados',
  },
];

export const getAppointments = async (patientId?: string | null): Promise<Appointment[]> => {
  if (isFirebaseConfigured()) {
    try {
      const { collection, getDocs, query, where, orderBy } = await import('firebase/firestore');
      const q = patientId
        ? query(collection(db, 'appointments'), where('patientId', '==', patientId), orderBy('date', 'asc'))
        : query(collection(db, 'appointments'), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    } catch (error: any) {
      console.warn('Firebase error, using demo data:', error.message);
      return patientId ? DEMO_APPOINTMENTS.filter(a => a.patientId === patientId) : DEMO_APPOINTMENTS;
    }
  }
  return patientId ? DEMO_APPOINTMENTS.filter(a => a.patientId === patientId) : DEMO_APPOINTMENTS;
};

export const createAppointment = async (data: Omit<Appointment, 'id'>): Promise<Appointment> => {
  const appointmentData: Omit<Appointment, 'id'> = {
    patientId: data.patientId ?? '',
    patientName: data.patientName ?? '',
    doctorName: data.doctorName ?? '',
    date: data.date ?? '',
    time: data.time ?? '',
    type: data.type ?? 'Fisioterapia',
    status: data.status ?? 'Pendiente',
    notes: data.notes ?? '',
  };

  if (isFirebaseConfigured()) {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...appointmentData };
    } catch (error: any) {
      console.warn('Firebase error:', error.message);
      throw error;
    }
  }
  const newAppt: Appointment = { id: `a${Date.now()}`, ...appointmentData };
  DEMO_APPOINTMENTS.push(newAppt);
  return newAppt;
};

export const updateAppointment = async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
  if (isFirebaseConfigured()) {
    try {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
      const docRef = doc(db, 'appointments', id);
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
      return { id, ...data } as Appointment;
    } catch (error: any) {
      console.warn('Firebase error:', error.message);
      throw error;
    }
  }
  const idx = DEMO_APPOINTMENTS.findIndex(a => a.id === id);
  if (idx !== -1) {
    DEMO_APPOINTMENTS[idx] = { ...DEMO_APPOINTMENTS[idx], ...data };
    return DEMO_APPOINTMENTS[idx];
  }
  throw new Error('Cita no encontrada');
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  if (isFirebaseConfigured()) {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'appointments', id));
      return true;
    } catch (error: any) {
      console.warn('Firebase error:', error.message);
      throw error;
    }
  }
  const idx = DEMO_APPOINTMENTS.findIndex(a => a.id === id);
  if (idx !== -1) DEMO_APPOINTMENTS.splice(idx, 1);
  return true;
};
