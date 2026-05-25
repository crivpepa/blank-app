export interface Patient {
  id: string;
  nombre: string;
  apellido: string;
  condicion: string;
  clinica: string;
  doctor: string;
  telefono: string;
  email: string;
  genero: string;
  fechaNacimiento: string;
  sesionesAutorizadas: number;
  sesionesRealizadas: number;
  proximaCita: string | null;
  status: 'Activo' | 'Alta' | 'Inactivo' | 'Suspendido';
  notas: string;
  createdAt: Date | any;
  updatedAt?: Date | any;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';
  notes: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  role?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
}
