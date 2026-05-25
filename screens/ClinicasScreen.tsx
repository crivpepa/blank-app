import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  patients: number;
  staff: number;
  status: string;
  schedule: string;
  specialties: string[];
  color: string;
  bg: string;
}

const CLINICS: Clinic[] = [
  { id: '1', name: 'Clínica Norte', address: 'Av. Insurgentes Norte 1234, Col. Lindavista, CDMX', phone: '+52 55 1111-2222', email: 'norte@recoveryclinic.com', director: 'Dr. Alejandro Ramírez', patients: 22, staff: 14, status: 'Activa', schedule: 'Lun–Vie 7:00–20:00 | Sáb 8:00–14:00', specialties: ['Fisioterapia', 'Neurología', 'Ortopedia'], color: '#2196F3', bg: '#E3F2FD' },
  { id: '2', name: 'Clínica Sur', address: 'Blvd. Adolfo López Mateos 567, Col. Narvarte, CDMX', phone: '+52 55 3333-4444', email: 'sur@recoveryclinic.com', director: 'Dra. Patricia Morales', patients: 18, staff: 11, status: 'Activa', schedule: 'Lun–Vie 8:00–19:00 | Sáb 9:00–13:00', specialties: ['Fisioterapia', 'Pediatría', 'Geriatría'], color: '#4CAF50', bg: '#E8F5E9' },
  { id: '3', name: 'Clínica Centro', address: 'Calle Madero 89, Centro Histórico, CDMX', phone: '+52 55 5555-6666', email: 'centro@recoveryclinic.com', director: 'Dr. Fernando Gutiérrez', patients: 8, staff: 8, status: 'Activa', schedule: 'Lun–Vie 9:00–18:00', specialties: ['Terapia Ocupacional', 'Psicología', 'Nutrición'], color: '#9C27B0', bg: '#F3E5F5' },
];

function ClinicCard({ clinic }: { clinic: Clinic }) {
  const handleCall = () => Linking.openURL(`tel:${clinic.phone.replace(/\s/g, '')}`);
  const handleEmail = () => Linking.openURL(`mailto:${clinic.email}`);

  return (
    <View style={styles.card}>
      <View style={[styles.cardHeader, { backgroundColor: clinic.color }]}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.clinicIconWrap}>
            <Ionicons name="business" size={28} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.clinicName}>{clinic.name}</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{clinic.status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.patientsTag}>
          <Text style={styles.patientsTagNum}>{clinic.patients}</Text>
          <Text style={styles.patientsTagLabel}>pac.</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        {[
          { icon: 'person', label: 'Director', value: clinic.director },
          { icon: 'location', label: 'Dirección', value: clinic.address },
          { icon: 'time', label: 'Horario', value: clinic.schedule },
        ].map(row => (
          <View key={row.label} style={styles.infoRow}>
            <View style={[styles.infoIconWrap, { backgroundColor: clinic.bg }]}>
              <Ionicons name={row.icon as any} size={16} color={clinic.color} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          </View>
        ))}

        <View style={styles.specialtiesWrap}>
          {clinic.specialties.map(s => (
            <View key={s} style={[styles.specialtyTag, { backgroundColor: clinic.bg }]}>
              <Text style={[styles.specialtyTagText, { color: clinic.color }]}>{s}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          {[{ icon: 'people', value: clinic.patients, label: 'Pacientes' }, { icon: 'medical', value: clinic.staff, label: 'Personal' }, { icon: 'ribbon', value: clinic.specialties.length, label: 'Especialidades' }].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <Ionicons name={s.icon as any} size={18} color={clinic.color} />
                <Text style={[styles.statValue, { color: clinic.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: clinic.bg, borderColor: clinic.color }]} onPress={handleCall} activeOpacity={0.75}>
            <Ionicons name="call-outline" size={16} color={clinic.color} />
            <Text style={[styles.actionBtnText, { color: clinic.color }]}>Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: clinic.bg, borderColor: clinic.color }]} onPress={handleEmail} activeOpacity={0.75}>
            <Ionicons name="mail-outline" size={16} color={clinic.color} />
            <Text style={[styles.actionBtnText, { color: clinic.color }]}>Correo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary, { backgroundColor: clinic.color }]} activeOpacity={0.75}>
            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
            <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Gestionar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ClinicasScreen() {
  const totalPatients = CLINICS.reduce((a, c) => a + c.patients, 0);
  const totalStaff = CLINICS.reduce((a, c) => a + c.staff, 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Clínicas</Text>
          <Text style={styles.headerSub}>{CLINICS.length} clínicas registradas</Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="add-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryStrip}>
        {[{ icon: 'business', value: CLINICS.length, label: 'Clínicas' }, { icon: 'people', value: totalPatients, label: 'Pacientes' }, { icon: 'medical', value: totalStaff, label: 'Personal' }, { icon: 'checkmark-circle', value: CLINICS.filter(c => c.status === 'Activa').length, label: 'Activas' }].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <View style={styles.summaryDivider} />}
            <View style={styles.summaryItem}>
              <Ionicons name={s.icon as any} size={18} color="rgba(255,255,255,0.9)" />
              <View style={styles.summaryTextWrap}>
                <Text style={styles.summaryValue}>{s.value}</Text>
                <Text style={styles.summaryLabel}>{s.label}</Text>
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {CLINICS.map(clinic => <ClinicCard key={clinic.id} clinic={clinic} />)}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2196F3' },
  header: { backgroundColor: '#2196F3', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  headerAction: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  summaryStrip: { backgroundColor: '#1976D2', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 12, paddingHorizontal: 16 },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryTextWrap: { alignItems: 'center' },
  summaryValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  summaryLabel: { fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  summaryDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' },
  scroll: { flex: 1, backgroundColor: '#F5F5F5', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 80 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  clinicIconWrap: { width: 50, height: 50, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  clinicName: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#A5D6A7', marginRight: 6 },
  statusText: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  patientsTag: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  patientsTagNum: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', lineHeight: 22 },
  patientsTagLabel: { fontSize: 10, color: 'rgba(255,255,255,0.8)' },
  cardBody: { padding: 18 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  infoIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#9E9E9E', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  infoValue: { fontSize: 13, color: '#424242', lineHeight: 18 },
  specialtiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  specialtyTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  specialtyTagText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 16 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 16 },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, color: '#9E9E9E' },
  statDivider: { width: 1, height: 36, backgroundColor: '#F0F0F0' },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5 },
  actionBtnPrimary: { borderWidth: 0 },
  actionBtnText: { fontSize: 13, fontWeight: '600' },
});
