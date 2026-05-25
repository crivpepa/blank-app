import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createAppointment } from '../services/appointmentService';
import { getPatients } from '../services/patientService';
import { Patient } from '../types';

const PRIMARY = '#2196F3';
const BG = '#F5F5F5';

const TIPOS = ['Fisioterapia', 'Evaluación', 'Seguimiento', 'Alta'];
const TIME_SLOTS: string[] = [];
for (let h = 7; h <= 19; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 19) TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
}

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function getNext7Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
      {children}
    </View>
  );
}

interface Props {
  route: { params?: { patient?: Patient } };
  navigation: any;
}

export default function AgendarCitaScreen({ route, navigation }: Props) {
  const prefillPatient = route?.params?.patient ?? null;

  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientSearch, setPatientSearch] = useState(
    prefillPatient ? `${prefillPatient.nombre} ${prefillPatient.apellido}` : ''
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(prefillPatient);
  const [showPatientList, setShowPatientList] = useState(false);
  const [doctor, setDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [notas, setNotas] = useState('');

  const days = getNext7Days();
  const filteredPatients = patients.filter(p =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(patientSearch.toLowerCase())
  );

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearch(`${patient.nombre} ${patient.apellido}`);
    setShowPatientList(false);
    if (!doctor && patient.doctor) setDoctor(patient.doctor);
  };

  const validate = (): boolean => {
    if (!selectedPatient) { Alert.alert('Campo requerido', 'Seleccione un paciente.'); return false; }
    if (!doctor.trim()) { Alert.alert('Campo requerido', 'Ingrese el nombre del doctor.'); return false; }
    if (!selectedTime) { Alert.alert('Campo requerido', 'Seleccione un horario.'); return false; }
    if (!selectedTipo) { Alert.alert('Campo requerido', 'Seleccione el tipo de cita.'); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validate() || !selectedPatient) return;
    setLoading(true);
    try {
      await createAppointment({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.nombre} ${selectedPatient.apellido}`,
        doctorName: doctor.trim(),
        date: selectedDate,
        time: selectedTime,
        type: selectedTipo,
        status: 'Pendiente',
        notes: notas,
      });
      Alert.alert('Cita agendada', 'La cita ha sido programada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo agendar la cita. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Cita</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Field label="Paciente" required>
            <TextInput
              style={styles.input}
              value={patientSearch}
              onChangeText={t => {
                setPatientSearch(t);
                setSelectedPatient(null);
                setShowPatientList(t.length > 0);
              }}
              placeholder="Buscar paciente..."
              placeholderTextColor="#BDBDBD"
            />
            {showPatientList && filteredPatients.length > 0 && (
              <View style={styles.dropdown}>
                {filteredPatients.slice(0, 5).map(p => (
                  <TouchableOpacity key={p.id} style={styles.dropdownItem} onPress={() => handlePatientSelect(p)}>
                    <Text style={styles.dropdownName}>{p.nombre} {p.apellido}</Text>
                    <Text style={styles.dropdownSub}>{p.condicion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Field>
          <Field label="Doctor" required>
            <TextInput style={styles.input} value={doctor} onChangeText={setDoctor} placeholder="Ej. Dr. Ramírez" placeholderTextColor="#BDBDBD" />
          </Field>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Fecha</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
          {days.map(day => {
            const dateStr = formatDate(day);
            const isSelected = selectedDate === dateStr;
            return (
              <TouchableOpacity key={dateStr} style={[styles.dayBtn, isSelected && styles.dayBtnActive]} onPress={() => setSelectedDate(dateStr)}>
                <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>{DAYS_ES[day.getDay()]}</Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>{day.getDate()}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Horario</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlotsScroll}>
          {TIME_SLOTS.map(slot => {
            const isSelected = selectedTime === slot;
            return (
              <TouchableOpacity key={slot} style={[styles.timeSlot, isSelected && styles.timeSlotActive]} onPress={() => setSelectedTime(slot)}>
                <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextActive]}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Tipo de Cita</Text></View>
        <View style={styles.tiposContainer}>
          {TIPOS.map(tipo => {
            const isSelected = selectedTipo === tipo;
            return (
              <TouchableOpacity key={tipo} style={[styles.tipoPill, isSelected && styles.tipoPillActive]} onPress={() => setSelectedTipo(tipo)}>
                <Text style={[styles.tipoPillText, isSelected && styles.tipoPillTextActive]}>{tipo}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Notas</Text></View>
        <View style={styles.card}>
          <View style={styles.field}>
            <TextInput style={[styles.input, styles.inputMultiline]} value={notas} onChangeText={setNotas} placeholder="Observaciones adicionales..." placeholderTextColor="#BDBDBD" multiline numberOfLines={4} textAlignVertical="top" />
          </View>
        </View>

        <View style={styles.saveSection}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="calendar-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>Confirmar Cita</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { backgroundColor: PRIMARY, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  scroll: { flex: 1 },
  card: { backgroundColor: '#fff', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, marginBottom: 4 },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#616161', textTransform: 'uppercase', letterSpacing: 0.5 },
  field: { paddingHorizontal: 16, paddingVertical: 12 },
  fieldLabel: { fontSize: 12, color: '#9E9E9E', marginBottom: 6, fontWeight: '500' },
  required: { color: '#F44336' },
  input: { fontSize: 15, color: '#212121', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FAFAFA' },
  inputMultiline: { minHeight: 100, paddingTop: 10 },
  dropdown: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', marginTop: 4, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  dropdownName: { fontSize: 15, fontWeight: '600', color: '#212121' },
  dropdownSub: { fontSize: 12, color: '#9E9E9E', marginTop: 2 },
  daysScroll: { paddingLeft: 16, paddingBottom: 8 },
  dayBtn: { width: 56, height: 72, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  dayBtnActive: { backgroundColor: PRIMARY, elevation: 4 },
  dayName: { fontSize: 11, color: '#9E9E9E', fontWeight: '500', marginBottom: 4 },
  dayNameActive: { color: 'rgba(255,255,255,0.85)' },
  dayNum: { fontSize: 22, fontWeight: '700', color: '#212121' },
  dayNumActive: { color: '#fff' },
  timeSlotsScroll: { paddingLeft: 16, paddingBottom: 8 },
  timeSlot: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 1.5, borderColor: '#E0E0E0', elevation: 1 },
  timeSlotActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  timeSlotText: { fontSize: 14, fontWeight: '600', color: '#616161' },
  timeSlotTextActive: { color: '#fff' },
  tiposContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, paddingBottom: 8 },
  tipoPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E0E0E0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  tipoPillActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  tipoPillText: { fontSize: 14, fontWeight: '600', color: '#616161' },
  tipoPillTextActive: { color: '#fff' },
  saveSection: { paddingHorizontal: 16, paddingTop: 20 },
  saveBtn: { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
