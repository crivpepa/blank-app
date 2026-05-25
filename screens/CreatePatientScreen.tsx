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
import { createPatient } from '../services/patientService';

const PRIMARY = '#2196F3';
const BG = '#F5F5F5';

const CLINICAS = ['Norte', 'Sur', 'Centro'];
const GENEROS = ['Masculino', 'Femenino', 'Otro'];
const STATUS_OPTS = ['Activo', 'Inactivo', 'Suspendido'];

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
      {children}
    </View>
  );
}

function TextInputField({ value, onChangeText, placeholder, keyboardType, multiline, numberOfLines }: any) {
  return (
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#BDBDBD"
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
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
  navigation: any;
}

export default function CreatePatientScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [condicion, setCondicion] = useState('');
  const [clinica, setClinica] = useState('Norte');
  const [doctor, setDoctor] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [genero, setGenero] = useState('Masculino');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sesionesAutorizadas, setSesionesAutorizadas] = useState('');
  const [notas, setNotas] = useState('');
  const [status, setStatus] = useState('Activo');

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
      await createPatient({
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
        sesionesRealizadas: 0,
        proximaCita: null,
        status: status as any,
        notas: notas.trim(),
      });
      Alert.alert('Paciente creado', 'El paciente fue registrado exitosamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo crear el paciente. Intente de nuevo.');
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
        <Text style={styles.headerTitle}>Nuevo Paciente</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <SectionHeader title="Información Personal" />
        <View style={styles.card}>
          <Field label="Nombre" required><TextInputField value={nombre} onChangeText={setNombre} placeholder="Ej. Carlos" /></Field>
          <Field label="Apellido" required><TextInputField value={apellido} onChangeText={setApellido} placeholder="Ej. Mendoza García" /></Field>
          <Field label="Género"><PickerField options={GENEROS} value={genero} onChange={setGenero} /></Field>
          <Field label="Fecha de Nacimiento"><TextInputField value={fechaNacimiento} onChangeText={setFechaNacimiento} placeholder="YYYY-MM-DD" /></Field>
          <Field label="Teléfono"><TextInputField value={telefono} onChangeText={setTelefono} placeholder="55 1234 5678" keyboardType="phone-pad" /></Field>
          <Field label="Email"><TextInputField value={email} onChangeText={setEmail} placeholder="correo@ejemplo.com" keyboardType="email-address" /></Field>
        </View>

        <SectionHeader title="Información Clínica" />
        <View style={styles.card}>
          <Field label="Condición / Diagnóstico" required><TextInputField value={condicion} onChangeText={setCondicion} placeholder="Ej. Lesión de rodilla" /></Field>
          <Field label="Doctor Responsable"><TextInputField value={doctor} onChangeText={setDoctor} placeholder="Ej. Dr. Ramírez" /></Field>
          <Field label="Clínica"><PickerField options={CLINICAS} value={clinica} onChange={setClinica} /></Field>
          <Field label="Sesiones Autorizadas"><TextInputField value={sesionesAutorizadas} onChangeText={setSesionesAutorizadas} placeholder="Ej. 20" keyboardType="numeric" /></Field>
          <Field label="Estado"><PickerField options={STATUS_OPTS} value={status} onChange={setStatus} /></Field>
        </View>

        <SectionHeader title="Notas" />
        <View style={styles.card}>
          <Field label="Observaciones">
            <TextInputField value={notas} onChangeText={setNotas} placeholder="Notas adicionales..." multiline numberOfLines={4} />
          </Field>
        </View>

        <View style={styles.saveSection}>
          <TouchableOpacity style={[styles.saveBtn, loading && { opacity: 0.7 }]} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>Guardar Paciente</Text>
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
  sectionHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#616161', textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, marginBottom: 4 },
  field: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  fieldLabel: { fontSize: 12, color: '#9E9E9E', marginBottom: 6, fontWeight: '500' },
  required: { color: '#F44336' },
  input: { fontSize: 15, color: '#212121', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FAFAFA' },
  inputMultiline: { minHeight: 90, paddingTop: 10 },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerOpt: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0' },
  pickerOptActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  pickerOptText: { fontSize: 13, color: '#616161', fontWeight: '500' },
  pickerOptTextActive: { color: '#fff' },
  saveSection: { paddingHorizontal: 16, paddingTop: 20 },
  saveBtn: { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
