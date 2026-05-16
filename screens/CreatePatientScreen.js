import React, { useState } from 'react';
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
import { createPatient } from '../services/patientService';

const PRIMARY = '#2196F3';
const BG = '#F5F5F5';

const CLINICAS = ['Norte', 'Sur', 'Centro'];
const GENEROS = ['Masculino', 'Femenino', 'Otro'];

function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Field({ label, required, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {children}
    </View>
  );
}

function TextInputField({ value, onChangeText, placeholder, keyboardType, multiline, numberOfLines }) {
  return (
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#BDBDBD"
      keyboardType={keyboardType || 'default'}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  );
}

function PickerField({ options, selected, onSelect }) {
  return (
    <View style={styles.pickerRow}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.pickerOption, selected === opt && styles.pickerOptionActive]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.pickerOptionText, selected === opt && styles.pickerOptionTextActive]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function CreatePatientScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [genero, setGenero] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [condicion, setCondicion] = useState('');
  const [clinica, setClinica] = useState('');
  const [doctor, setDoctor] = useState('');
  const [sesionesAutorizadas, setSesionesAutorizadas] = useState('');
  const [notas, setNotas] = useState('');

  const validate = () => {
    if (!nombre.trim()) { Alert.alert('Campo requerido', 'El nombre es obligatorio.'); return false; }
    if (!apellido.trim()) { Alert.alert('Campo requerido', 'El apellido es obligatorio.'); return false; }
    if (!condicion.trim()) { Alert.alert('Campo requerido', 'La condición clínica es obligatoria.'); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createPatient({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        fechaNacimiento,
        genero,
        telefono,
        email,
        condicion: condicion.trim(),
        clinica,
        doctor,
        sesionesAutorizadas: parseInt(sesionesAutorizadas) || 0,
        sesionesRealizadas: 0,
        notas,
        status: 'Activo',
      });
      Alert.alert('Éxito', 'Paciente creado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear el paciente. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Paciente</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveBtnText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Información Personal */}
        <SectionHeader title="Información Personal" />
        <View style={styles.card}>
          <Field label="Nombre" required>
            <TextInputField value={nombre} onChangeText={setNombre} placeholder="Ej. Carlos" />
          </Field>
          <Field label="Apellido" required>
            <TextInputField value={apellido} onChangeText={setApellido} placeholder="Ej. Mendoza García" />
          </Field>
          <Field label="Fecha de nacimiento">
            <TextInputField
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
              placeholder="AAAA-MM-DD"
            />
          </Field>
          <Field label="Género">
            <PickerField options={GENEROS} selected={genero} onSelect={setGenero} />
          </Field>
          <Field label="Teléfono">
            <TextInputField
              value={telefono}
              onChangeText={setTelefono}
              placeholder="55 1234 5678"
              keyboardType="phone-pad"
            />
          </Field>
          <Field label="Correo electrónico">
            <TextInputField
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
            />
          </Field>
        </View>

        {/* Información Clínica */}
        <SectionHeader title="Información Clínica" />
        <View style={styles.card}>
          <Field label="Condición / Diagnóstico" required>
            <TextInputField value={condicion} onChangeText={setCondicion} placeholder="Ej. Lesión de rodilla" />
          </Field>
          <Field label="Clínica">
            <PickerField options={CLINICAS} selected={clinica} onSelect={setClinica} />
          </Field>
          <Field label="Doctor asignado">
            <TextInputField value={doctor} onChangeText={setDoctor} placeholder="Ej. Dr. Ramírez" />
          </Field>
          <Field label="Sesiones autorizadas">
            <TextInputField
              value={sesionesAutorizadas}
              onChangeText={setSesionesAutorizadas}
              placeholder="Ej. 20"
              keyboardType="numeric"
            />
          </Field>
        </View>

        {/* Notas iniciales */}
        <SectionHeader title="Notas Iniciales" />
        <View style={styles.card}>
          <Field label="Observaciones">
            <TextInputField
              value={notas}
              onChangeText={setNotas}
              placeholder="Agregar notas o comentarios iniciales..."
              multiline
              numberOfLines={5}
            />
          </Field>
        </View>

        <View style={{ height: 40 }} />
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
  saveBtn: { paddingHorizontal: 4, minWidth: 56, alignItems: 'flex-end' },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  scroll: { flex: 1 },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#616161', textTransform: 'uppercase', letterSpacing: 0.5 },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  field: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  fieldLabel: { fontSize: 12, color: '#9E9E9E', marginBottom: 6, fontWeight: '500' },
  required: { color: '#F44336' },
  input: {
    fontSize: 15,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  inputMultiline: { minHeight: 100, paddingTop: 10 },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  pickerOptionActive: { borderColor: PRIMARY, backgroundColor: '#E3F2FD' },
  pickerOptionText: { fontSize: 13, color: '#616161', fontWeight: '500' },
  pickerOptionTextActive: { color: PRIMARY, fontWeight: '700' },
});
