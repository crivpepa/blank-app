import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getAppointments, updateAppointment } from '../services/appointmentService';

const PRIMARY = '#2196F3';
const BG = '#F5F5F5';

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const TYPE_COLORS = {
  Fisioterapia: '#2196F3',
  Evaluación: '#9C27B0',
  Seguimiento: '#FF9800',
  Alta: '#4CAF50',
};

const STATUS_COLORS = {
  Confirmada: { bg: '#E8F5E9', text: '#2E7D32' },
  Pendiente: { bg: '#FFF3E0', text: '#E65100' },
  Completada: { bg: '#F3E5F5', text: '#6A1B9A' },
  Cancelada: { bg: '#FFEBEE', text: '#B71C1C' },
};

function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function isAM(time) {
  const hour = parseInt(time.split(':')[0]);
  return hour < 12;
}

export default function CitasScreen({ navigation }) {
  const days = getNext7Days();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [])
  );

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const todayAppts = appointments.filter(a => a.date === selectedDate);
  const morningAppts = todayAppts.filter(a => isAM(a.time)).sort((a, b) => a.time.localeCompare(b.time));
  const afternoonAppts = todayAppts.filter(a => !isAM(a.time)).sort((a, b) => a.time.localeCompare(b.time));

  const handleLongPress = (appt) => {
    if (appt.status === 'Cancelada' || appt.status === 'Completada') return;
    Alert.alert(
      'Gestionar cita',
      `${appt.patientName} - ${appt.time}`,
      [
        { text: 'Cancelar acción', style: 'cancel' },
        {
          text: 'Marcar como completada',
          onPress: () => markAs(appt.id, 'Completada'),
        },
        {
          text: 'Cancelar cita',
          style: 'destructive',
          onPress: () => markAs(appt.id, 'Cancelada'),
        },
      ]
    );
  };

  const markAs = async (id, status) => {
    try {
      await updateAppointment(id, { status });
      setAppointments(prev =>
        prev.map(a => a.id === id ? { ...a, status } : a)
      );
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar la cita.');
    }
  };

  const selectedDay = days.find(d => formatDate(d) === selectedDate);
  const dateLabel = selectedDay
    ? `${DAYS_ES[selectedDay.getDay()]} ${selectedDay.getDate()} ${MONTHS_ES[selectedDay.getMonth()]}`
    : '';

  const renderAppointmentCard = (appt) => {
    const typeColor = TYPE_COLORS[appt.type] || PRIMARY;
    const statusStyle = STATUS_COLORS[appt.status] || STATUS_COLORS.Pendiente;

    return (
      <TouchableOpacity
        key={appt.id}
        style={styles.apptCard}
        onLongPress={() => handleLongPress(appt)}
        delayLongPress={400}
        activeOpacity={0.8}
      >
        <View style={[styles.apptColorBar, { backgroundColor: typeColor }]} />
        <View style={styles.apptTimeCol}>
          <Text style={styles.apptTime}>{appt.time}</Text>
        </View>
        <View style={styles.apptMainCol}>
          <Text style={styles.apptPatient}>{appt.patientName}</Text>
          <Text style={styles.apptDoctor}>{appt.doctorName}</Text>
          <View style={styles.apptBadgesRow}>
            <View style={[styles.typeBadge, { backgroundColor: typeColor + '20' }]}>
              <Text style={[styles.typeBadgeText, { color: typeColor }]}>{appt.type}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>{appt.status}</Text>
            </View>
          </View>
        </View>
        <Ionicons name="ellipsis-vertical" size={16} color="#BDBDBD" />
      </TouchableOpacity>
    );
  };

  const renderGroup = (title, apptList) => {
    if (apptList.length === 0) return null;
    return (
      <View style={styles.group}>
        <View style={styles.groupHeader}>
          <Ionicons name={title === 'Mañana' ? 'sunny-outline' : 'moon-outline'} size={14} color="#9E9E9E" />
          <Text style={styles.groupTitle}>{title}</Text>
          <Text style={styles.groupCount}>{apptList.length} cita{apptList.length !== 1 ? 's' : ''}</Text>
        </View>
        {apptList.map(renderAppointmentCard)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Citas</Text>
        <Text style={styles.headerSubtitle}>{dateLabel}</Text>
      </View>

      {/* Day Selector */}
      <View style={styles.daySelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelectorContent}>
          {days.map(day => {
            const dateStr = formatDate(day);
            const isSelected = selectedDate === dateStr;
            const count = appointments.filter(a => a.date === dateStr).length;
            return (
              <TouchableOpacity
                key={dateStr}
                style={[styles.dayBtn, isSelected && styles.dayBtnActive]}
                onPress={() => setSelectedDate(dateStr)}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
                  {DAYS_ES[day.getDay()]}
                </Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>
                  {day.getDate()}
                </Text>
                {count > 0 && (
                  <View style={[styles.dayDot, isSelected && styles.dayDotActive]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={PRIMARY} size="large" />
          <Text style={styles.loadingText}>Cargando citas...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {todayAppts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#BDBDBD" />
              <Text style={styles.emptyTitle}>Sin citas</Text>
              <Text style={styles.emptySubtitle}>No hay citas programadas para este día</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('AgendarCita')}
              >
                <Text style={styles.emptyBtnText}>Agendar cita</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.apptList}>
              {renderGroup('Mañana', morningAppts)}
              {renderGroup('Tarde', afternoonAppts)}
            </View>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AgendarCita')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  daySelector: { backgroundColor: PRIMARY, paddingBottom: 16 },
  daySelectorContent: { paddingHorizontal: 16, gap: 10 },
  dayBtn: {
    width: 52,
    height: 76,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtnActive: { backgroundColor: '#fff' },
  dayName: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 4 },
  dayNameActive: { color: '#9E9E9E' },
  dayNum: { fontSize: 22, fontWeight: '700', color: '#fff' },
  dayNumActive: { color: PRIMARY },
  dayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)', marginTop: 4 },
  dayDotActive: { backgroundColor: PRIMARY },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#9E9E9E', fontSize: 14 },
  scroll: { flex: 1 },
  apptList: { padding: 16 },
  group: { marginBottom: 8 },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
  },
  groupTitle: { fontSize: 13, fontWeight: '700', color: '#616161', marginLeft: 6, flex: 1, textTransform: 'uppercase', letterSpacing: 0.5 },
  groupCount: { fontSize: 12, color: '#BDBDBD' },
  apptCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: 'hidden',
    paddingRight: 14,
  },
  apptColorBar: { width: 4, alignSelf: 'stretch' },
  apptTimeCol: { width: 56, alignItems: 'center', paddingVertical: 16 },
  apptTime: { fontSize: 14, fontWeight: '700', color: '#212121' },
  apptMainCol: { flex: 1, paddingVertical: 14, paddingLeft: 4 },
  apptPatient: { fontSize: 15, fontWeight: '700', color: '#212121', marginBottom: 2 },
  apptDoctor: { fontSize: 12, color: '#9E9E9E', marginBottom: 6 },
  apptBadgesRow: { flexDirection: 'row', gap: 6 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  typeBadgeText: { fontSize: 11, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#424242', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#9E9E9E', textAlign: 'center', marginTop: 8 },
  emptyBtn: { backgroundColor: PRIMARY, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 24 },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
