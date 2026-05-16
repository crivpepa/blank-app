import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAppointments } from '../services/appointmentService';

const PRIMARY = '#2196F3';
const BG = '#F5F5F5';

const STATUS_COLORS = {
  Activo: { bg: '#E3F2FD', text: '#1565C0' },
  Alta: { bg: '#E8F5E9', text: '#2E7D32' },
  Inactivo: { bg: '#F5F5F5', text: '#616161' },
  Suspendido: { bg: '#FFF3E0', text: '#E65100' },
};

const TIPO_COLORS = {
  Fisioterapia: '#2196F3',
  Evaluación: '#9C27B0',
  Seguimiento: '#FF9800',
  Alta: '#4CAF50',
};

const HISTORIAL_DEMO = [
  { id: 's1', fecha: '2026-05-10', tipo: 'Fisioterapia', doctor: 'Dr. Ramírez', duracion: '45 min', notas: 'Ejercicios de fortalecimiento completados' },
  { id: 's2', fecha: '2026-05-07', tipo: 'Evaluación', doctor: 'Dra. Gutiérrez', duracion: '60 min', notas: 'Evaluación mensual. Buen progreso.' },
  { id: 's3', fecha: '2026-05-03', tipo: 'Fisioterapia', doctor: 'Dr. Ramírez', duracion: '45 min', notas: 'Ultrasonido terapéutico y masaje' },
  { id: 's4', fecha: '2026-04-29', tipo: 'Seguimiento', doctor: 'Dr. Ramírez', duracion: '30 min', notas: 'Revisión de ejercicios en casa' },
  { id: 's5', fecha: '2026-04-25', tipo: 'Fisioterapia', doctor: 'Dr. Ramírez', duracion: '45 min', notas: 'Inicio de protocolo de recuperación' },
];

function InfoCard({ icon, label, value }) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={20} color={PRIMARY} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );
}

export default function PatientDetailScreen({ route, navigation }) {
  const { patient } = route.params;
  const [activeTab, setActiveTab] = useState('Historial');
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [notas, setNotas] = useState(patient.notas || '');

  const statusColor = STATUS_COLORS[patient.status] || STATUS_COLORS.Inactivo;
  const fullName = `${patient.nombre} ${patient.apellido}`;
  const initials = `${(patient.nombre || '?')[0]}${(patient.apellido || '?')[0]}`.toUpperCase();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getAppointments(patient.id);
      setAppointments(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoadingAppts(false);
    }
  };

  const sesionesEsteMes = () => {
    const now = new Date();
    return HISTORIAL_DEMO.filter(s => {
      const d = new Date(s.fecha);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  };

  const proximaCita = appointments.find(a => {
    const d = new Date(a.date);
    return d >= new Date() && a.status !== 'Cancelada';
  });

  const renderHistorial = () => (
    <View>
      {HISTORIAL_DEMO.map(session => (
        <View key={session.id} style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View style={[styles.tipoBadge, { backgroundColor: (TIPO_COLORS[session.tipo] || PRIMARY) + '20' }]}>
              <Text style={[styles.tipoBadgeText, { color: TIPO_COLORS[session.tipo] || PRIMARY }]}>
                {session.tipo}
              </Text>
            </View>
            <Text style={styles.sessionDuracion}>{session.duracion}</Text>
          </View>
          <Text style={styles.sessionDoctor}>{session.doctor}</Text>
          <Text style={styles.sessionNotas}>{session.notas}</Text>
          <Text style={styles.sessionFecha}>{session.fecha}</Text>
        </View>
      ))}
    </View>
  );

  const renderCitas = () => {
    if (loadingAppts) return <ActivityIndicator color={PRIMARY} style={{ marginTop: 20 }} />;
    if (appointments.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#BDBDBD" />
          <Text style={styles.emptyText}>Sin citas programadas</Text>
        </View>
      );
    }
    return (
      <View>
        {appointments.map(appt => (
          <View key={appt.id} style={styles.apptCard}>
            <View style={styles.apptTimeWrap}>
              <Text style={styles.apptTime}>{appt.time}</Text>
              <Text style={styles.apptDate}>{appt.date}</Text>
            </View>
            <View style={styles.apptInfo}>
              <Text style={styles.apptDoctor}>{appt.doctorName}</Text>
              <View style={[styles.tipoBadge, { backgroundColor: (TIPO_COLORS[appt.type] || PRIMARY) + '20' }]}>
                <Text style={[styles.tipoBadgeText, { color: TIPO_COLORS[appt.type] || PRIMARY }]}>
                  {appt.type}
                </Text>
              </View>
            </View>
            <View style={[styles.statusDot, { backgroundColor: appt.status === 'Confirmada' ? '#4CAF50' : '#FF9800' }]} />
          </View>
        ))}
      </View>
    );
  };

  const renderNotas = () => (
    <View style={styles.notasCard}>
      <Text style={styles.notasTitle}>Notas Clínicas</Text>
      <TextInput
        style={styles.notasInput}
        multiline
        value={notas}
        onChangeText={setNotas}
        placeholder="Agregar notas clínicas..."
        placeholderTextColor="#BDBDBD"
        textAlignVertical="top"
      />
      <TouchableOpacity
        style={styles.saveNotasBtn}
        onPress={() => Alert.alert('Guardado', 'Notas actualizadas correctamente')}
      >
        <Text style={styles.saveNotasBtnText}>Guardar Notas</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Paciente</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditPatient', { patient })}
          style={styles.editBtn}
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Patient Hero */}
        <View style={styles.heroCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.patientName}>{fullName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>{patient.status}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{patient.sesionesRealizadas || 0}</Text>
            <Text style={styles.statLabel}>Sesiones{'\n'}Totales</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMiddle]}>
            <Text style={styles.statNumber}>{sesionesEsteMes()}</Text>
            <Text style={styles.statLabel}>Este{'\n'}Mes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{proximaCita ? proximaCita.date : '—'}</Text>
            <Text style={styles.statLabel}>Próxima{'\n'}Cita</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <InfoCard icon="medical" label="Condición" value={patient.condicion} />
          <InfoCard icon="business" label="Clínica" value={patient.clinica} />
          <InfoCard icon="person" label="Doctor" value={patient.doctor} />
          <InfoCard icon="call" label="Teléfono" value={patient.telefono} />
          <InfoCard icon="mail" label="Email" value={patient.email} />
          <InfoCard icon="fitness" label="Sesiones autorizadas" value={`${patient.sesionesAutorizadas || '—'}`} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['Historial', 'Citas', 'Notas'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Historial' && renderHistorial()}
          {activeTab === 'Citas' && renderCitas()}
          {activeTab === 'Notas' && renderNotas()}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  editBtn: { padding: 4 },
  scroll: { flex: 1 },
  heroCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  patientName: { fontSize: 22, fontWeight: '700', color: '#212121', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 13, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statBoxMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#F5F5F5' },
  statNumber: { fontSize: 18, fontWeight: '700', color: PRIMARY, marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#9E9E9E', textAlign: 'center', lineHeight: 15 },
  section: { backgroundColor: '#fff', marginBottom: 12, paddingVertical: 8, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#616161', paddingHorizontal: 16, paddingVertical: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  infoIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#9E9E9E', marginBottom: 2 },
  infoValue: { fontSize: 15, color: '#212121', fontWeight: '500' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 2, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2 },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: PRIMARY },
  tabText: { fontSize: 14, color: '#9E9E9E', fontWeight: '500' },
  tabTextActive: { color: PRIMARY, fontWeight: '700' },
  tabContent: { paddingHorizontal: 16, paddingTop: 12 },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  tipoBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  tipoBadgeText: { fontSize: 12, fontWeight: '600' },
  sessionDuracion: { fontSize: 12, color: '#9E9E9E' },
  sessionDoctor: { fontSize: 13, color: '#616161', marginBottom: 4 },
  sessionNotas: { fontSize: 13, color: '#212121', marginBottom: 4 },
  sessionFecha: { fontSize: 11, color: '#BDBDBD' },
  apptCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  apptTimeWrap: { marginRight: 14, alignItems: 'center' },
  apptTime: { fontSize: 18, fontWeight: '700', color: PRIMARY },
  apptDate: { fontSize: 11, color: '#9E9E9E' },
  apptInfo: { flex: 1 },
  apptDoctor: { fontSize: 14, fontWeight: '600', color: '#212121', marginBottom: 4 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { marginTop: 12, fontSize: 15, color: '#9E9E9E' },
  notasCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  notasTitle: { fontSize: 15, fontWeight: '700', color: '#212121', marginBottom: 12 },
  notasInput: { minHeight: 160, fontSize: 14, color: '#212121', lineHeight: 22, padding: 0 },
  saveNotasBtn: { backgroundColor: PRIMARY, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  saveNotasBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
