import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { updatePatient, deletePatient } from '../services/patientService';
import { Patient } from '../types';

const PRIMARY = '#2196F3';
const BG = '#F5F5F5';

const CLINICAS = ['Norte', 'Sur', 'Centro'];
const GENEROS = ['Masculino', 'Femenino', 'Otro'];
const STATUS_OPTS = ['Activo', 'Alta', 'Inactivo', 'Suspendido'];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
      {children}
    </View>
  );
}

function PickerField({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.pickerRow}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.pickerOpt, value === opt && styles.pickerOptActive]}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.pickerOptText, value === opt && styles.pickerOptTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface Props {
  route: { params: { patient: Patient } };
  navigation: any;
}

export default function EditPatientScreen({ route, navigation }: Props) {
  const { patient } = route.params;
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState(patient.nombre);
  const [apellido, setApellido] = useState(patient.apellido);
  const [condicion, setCondicion] = useState(patient.condicion);
  const [clinica, setClinica] = useState(patient.clinica);
  const [doctor, setDoctor] = useState(patient.doctor);
  const [telefono, setTelefono] = useState(patient.telefono);
  const [email, setEmail] = useState(patient.email);
  const [genero, setGenero] = useState(patient.genero);
  const [fechaNacimiento, setFechaNacimiento] = useState(patient.fechaNacimiento);
  const [sesionesAutorizadas, setSesionesAutorizadas] = useState(String(patient.sesionesAutorizadas || ''));
  const [notas, setNotas] = useState(patient.notas);
  const [status, setStatus] = useState(patient.status);

  const validate = (): boolean => {
    if (!nombre.trim()) { Alert.alert('Campo requerido', 'El nombre es obligatorio.'); return false; }
    if (!apellido.trim()) { Alert.alert('Campo requerido', 'El apellido es obligatorio.'); return false; }
    if (!condicion.trim()) { Alert.alert('Campo requerido', 'La condición es obligatoria.'); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await updatePatient(patient.id, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        condicion: condicion.trim(),
        clinica,
        doctor: doctor.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        genero,
        fechaNacimiento: fechaNacimiento.trim(),
        sesionesAutorizadas: parseInt(sesionesAutorizadas) || 0,
        status,
        notas: notas.trim(),
      });
      Alert.alert('Actualizado', 'Datos del paciente actualizados.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el paciente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Paciente',
      `¿Está seguro de eliminar a ${patient.nombre} ${patient.apellido}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deletePatient(patient.id);
              navigation.navigate('Pacientes');
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el paciente.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const inputStyle = { fontSize: 15 as const, color: '#212121' as const, borderWidth: 1, borderColor: '#E0E0E0' as const, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FAFAFA' as const };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Paciente</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Información Personal</Text></View>
        <View style={styles.card}>
          <Field label="Nombre" required>
            <TextInput style={inputStyle} value={nombre} onChangeText={setNombre} />
          </Field>
          <Field label="Apellido" required>
            <TextInput style={inputStyle} value={apellido} onChangeText={setApellido} />
          </Field>
          <Field label="Género">
            <PickerField options={GENEROS} value={genero} onChange={setGenero} />
          </Field>
          <Field label="Fecha de Nacimiento">
            <TextInput style={inputStyle} value={fechaNacimiento} onChangeText={setFechaNacimiento} placeholder="YYYY-MM-DD" placeholderTextColor="#BDBDBD" />
          </Field>
          <Field label="Teléfono">
            <TextInput style={inputStyle} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
          </Field>
          <Field label="Email">
            <TextInput style={inputStyle} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </Field>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Información Clínica</Text></View>
        <View style={styles.card}>
          <Field label="Condición / Diagnóstico" required>
            <TextInput style={inputStyle} value={condicion} onChangeText={setCondicion} />
          </Field>
          <Field label="Doctor Responsable">
            <TextInput style={inputStyle} value={doctor} onChangeText={setDoctor} />
          </Field>
          <Field label="Clínica">
            <PickerField options={CLINICAS} value={clinica} onChange={setClinica} />
          </Field>
          <Field label="Sesiones Autorizadas">
            <TextInput style={inputStyle} value={sesionesAutorizadas} onChangeText={setSesionesAutorizadas} keyboardType="numeric" />
          </Field>
          <Field label="Estado">
            <PickerField options={STATUS_OPTS} value={status} onChange={(v) => setStatus(v as Patient['status'])} />
          </Field>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Notas</Text></View>
        <View style={styles.card}>
          <Field label="Observaciones">
            <TextInput
              style={[inputStyle, { minHeight: 90, paddingTop: 10 }]}
              value={notas}
              onChangeText={setNotas}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </Field>
        </View>

        <View style={styles.saveSection}>
          <TouchableOpacity style={[styles.saveBtn, loading && { opacity: 0.7 }]} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>Guardar Cambios</Text>
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
  deleteBtn: { padding: 4 },
  scroll: { flex: 1 },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#616161', textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, marginBottom: 4 },
  field: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  fieldLabel: { fontSize: 12, color: '#9E9E9E', marginBottom: 6, fontWeight: '500' },
  required: { color: '#F44336' },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerOpt: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0' },
  pickerOptActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  pickerOptText: { fontSize: 13, color: '#616161', fontWeight: '500' },
  pickerOptTextActive: { color: '#fff' },
  saveSection: { paddingHorizontal: 16, paddingTop: 20 },
  saveBtn: { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
