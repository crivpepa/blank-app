import { db } from './firebase';

const isFirebaseConfigured = () => {
  try {
    return db && db.app && db.app.options.apiKey !== 'YOUR_API_KEY';
  } catch {
    return false;
  }
};

const DEMO_DATA = [
  {
    id: 'p001',
    nombre: 'Carlos',
    apellido: 'Mendoza García',
    condicion: 'Lesión de rodilla',
    clinica: 'Norte',
    doctor: 'Dr. Ramírez',
    telefono: '55 1234 5678',
    email: 'carlos.mendoza@email.com',
    genero: 'Masculino',
    fechaNacimiento: '1985-03-15',
    sesionesAutorizadas: 20,
    sesionesRealizadas: 12,
    proximaCita: '2026-05-20',
    status: 'Activo',
    notas: 'Paciente con buena evolución. Mantener ejercicios de fortalecimiento.',
    createdAt: new Date('2026-01-10'),
  },
  {
    id: 'p002',
    nombre: 'María',
    apellido: 'López Herrera',
    condicion: 'Rehabilitación post-operatoria',
    clinica: 'Sur',
    doctor: 'Dra. Gutiérrez',
    telefono: '55 2345 6789',
    email: 'maria.lopez@email.com',
    genero: 'Femenino',
    fechaNacimiento: '1990-07-22',
    sesionesAutorizadas: 30,
    sesionesRealizadas: 8,
    proximaCita: '2026-05-18',
    status: 'Activo',
    notas: 'Progreso lento pero constante. Requiere atención especial en movilidad de cadera.',
    createdAt: new Date('2026-02-05'),
  },
  {
    id: 'p003',
    nombre: 'José',
    apellido: 'Rodríguez Sánchez',
    condicion: 'Fractura de muñeca',
    clinica: 'Centro',
    doctor: 'Dr. Morales',
    telefono: '55 3456 7890',
    email: 'jose.rodriguez@email.com',
    genero: 'Masculino',
    fechaNacimiento: '1978-11-08',
    sesionesAutorizadas: 15,
    sesionesRealizadas: 15,
    proximaCita: null,
    status: 'Alta',
    notas: 'Tratamiento completado exitosamente. Alta médica otorgada.',
    createdAt: new Date('2026-01-20'),
  },
  {
    id: 'p004',
    nombre: 'Ana',
    apellido: 'Torres Vega',
    condicion: 'Lumbalgia crónica',
    clinica: 'Norte',
    doctor: 'Dra. Flores',
    telefono: '55 4567 8901',
    email: 'ana.torres@email.com',
    genero: 'Femenino',
    fechaNacimiento: '1965-04-30',
    sesionesAutorizadas: 24,
    sesionesRealizadas: 3,
    proximaCita: '2026-05-22',
    status: 'Activo',
    notas: 'Paciente nueva. Evaluación inicial realizada.',
    createdAt: new Date('2026-05-01'),
  },
  {
    id: 'p005',
    nombre: 'Luis',
    apellido: 'Martínez Ruiz',
    condicion: 'Tendinitis de hombro',
    clinica: 'Sur',
    doctor: 'Dr. Ramírez',
    telefono: '55 5678 9012',
    email: 'luis.martinez@email.com',
    genero: 'Masculino',
    fechaNacimiento: '1992-09-14',
    sesionesAutorizadas: 18,
    sesionesRealizadas: 6,
    proximaCita: '2026-05-19',
    status: 'Activo',
    notas: 'Responde bien a ultrasonido terapéutico.',
    createdAt: new Date('2026-03-15'),
  },
];

export const getPatients = async () => {
  if (isFirebaseConfigured()) {
    try {
      const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
      const q = query(collection(db, 'patients'), orderBy('nombre', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn('Firebase error, using demo data:', error.message);
      return DEMO_DATA;
    }
  }
  return DEMO_DATA;
};

export const getPatient = async (id) => {
  if (isFirebaseConfigured()) {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'patients', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.warn('Firebase error:', error.message);
      return DEMO_DATA.find(p => p.id === id) || null;
    }
  }
  return DEMO_DATA.find(p => p.id === id) || null;
};

export const createPatient = async (data) => {
  if (isFirebaseConfigured()) {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, 'patients'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.warn('Firebase error:', error.message);
      throw error;
    }
  }
  // Demo: simulate creation
  const newPatient = { id: `p${Date.now()}`, ...data, createdAt: new Date() };
  DEMO_DATA.push(newPatient);
  return newPatient;
};

export const updatePatient = async (id, data) => {
  if (isFirebaseConfigured()) {
    try {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
      const docRef = doc(db, 'patients', id);
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
      return { id, ...data };
    } catch (error) {
      console.warn('Firebase error:', error.message);
      throw error;
    }
  }
  // Demo: simulate update
  const idx = DEMO_DATA.findIndex(p => p.id === id);
  if (idx !== -1) {
    DEMO_DATA[idx] = { ...DEMO_DATA[idx], ...data };
    return DEMO_DATA[idx];
  }
  throw new Error('Paciente no encontrado');
};

export const deletePatient = async (id) => {
  if (isFirebaseConfigured()) {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'patients', id));
      return true;
    } catch (error) {
      console.warn('Firebase error:', error.message);
      throw error;
    }
  }
  // Demo: simulate delete
  const idx = DEMO_DATA.findIndex(p => p.id === id);
  if (idx !== -1) {
    DEMO_DATA.splice(idx, 1);
  }
  return true;
};
