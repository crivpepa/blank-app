import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../App';

const STATS = [
  {
    id: '1',
    label: 'Total Pacientes',
    value: '48',
    icon: 'people',
    color: '#2196F3',
    bg: '#E3F2FD',
    trend: '+3 este mes',
    trendUp: true,
  },
  {
    id: '2',
    label: 'Citas Hoy',
    value: '12',
    icon: 'calendar',
    color: '#4CAF50',
    bg: '#E8F5E9',
    trend: '4 completadas',
    trendUp: true,
  },
  {
    id: '3',
    label: 'Familias Activas',
    value: '23',
    icon: 'heart',
    color: '#FF5722',
    bg: '#FBE9E7',
    trend: '+1 este mes',
    trendUp: true,
  },
  {
    id: '4',
    label: 'Clínicas',
    value: '3',
    icon: 'business',
    color: '#9C27B0',
    bg: '#F3E5F5',
    trend: 'Todas activas',
    trendUp: true,
  },
];

const ACTIVITIES = [
  {
    id: '1',
    icon: 'person-add',
    iconColor: '#2196F3',
    iconBg: '#E3F2FD',
    title: 'Nuevo paciente registrado',
    subtitle: 'María García Rodríguez fue admitida',
    time: 'Hace 15 min',
  },
  {
    id: '2',
    icon: 'calendar-outline',
    iconColor: '#4CAF50',
    iconBg: '#E8F5E9',
    title: 'Cita completada',
    subtitle: 'Sesión de fisioterapia — Dr. Ramírez',
    time: 'Hace 1 hora',
  },
  {
    id: '3',
    icon: 'document-text-outline',
    iconColor: '#FF9800',
    iconBg: '#FFF3E0',
    title: 'Informe generado',
    subtitle: 'Reporte mensual de Clínica Norte',
    time: 'Hace 2 horas',
  },
  {
    id: '4',
    icon: 'people-outline',
    iconColor: '#9C27B0',
    iconBg: '#F3E5F5',
    title: 'Nueva familia vinculada',
    subtitle: 'Familia Martínez asignada a Clínica Sur',
    time: 'Hace 3 horas',
  },
];

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
  const today = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconWrap}>
            <Ionicons name="medical" size={22} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Recovery App</Text>
            <Text style={styles.headerDate}>{todayCapitalized}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Banner */}
        <View style={styles.greetingBanner}>
          <View>
            <Text style={styles.greetingText}>
              {greeting}, {user?.name || 'Administrador'} 👋
            </Text>
            <Text style={styles.greetingSubtext}>
              Aquí está el resumen de hoy
            </Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <Text style={styles.sectionTitle}>Resumen General</Text>
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: stat.bg }]}>
                <Ionicons name={stat.icon} size={26} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <View style={styles.statTrend}>
                <Ionicons
                  name={stat.trendUp ? 'trending-up' : 'trending-down'}
                  size={12}
                  color={stat.trendUp ? '#4CAF50' : '#F44336'}
                />
                <Text
                  style={[
                    styles.statTrendText,
                    { color: stat.trendUp ? '#4CAF50' : '#F44336' },
                  ]}
                >
                  {' '}
                  {stat.trend}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="person-add-outline" size={22} color="#2196F3" />
            </View>
            <Text style={styles.quickActionText}>Nuevo Paciente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="calendar-outline" size={22} color="#4CAF50" />
            </View>
            <Text style={styles.quickActionText}>Agendar Cita</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="document-text-outline" size={22} color="#FF9800" />
            </View>
            <Text style={styles.quickActionText}>Ver Informes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="settings-outline" size={22} color="#9C27B0" />
            </View>
            <Text style={styles.quickActionText}>Configurar</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          {ACTIVITIES.map((item, index) => (
            <View key={item.id}>
              <View style={styles.activityItem}>
                <View
                  style={[
                    styles.activityIconWrap,
                    { backgroundColor: item.iconBg },
                  ]}
                >
                  <Ionicons name={item.icon} size={20} color={item.iconColor} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              {index < ACTIVITIES.length - 1 && (
                <View style={styles.activityDivider} />
              )}
            </View>
          ))}
        </View>

        {/* Spacer */}
        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2196F3',
  },

  // Header
  header: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerDate: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 1,
  },
  logoutBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  // Greeting Banner
  greetingBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  greetingText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#212121',
  },
  greetingSubtext: {
    fontSize: 13,
    color: '#757575',
    marginTop: 3,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Section Title
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212121',
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
    marginBottom: 6,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTrendText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAction: {
    width: '23%',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 11,
    color: '#424242',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Activity Section
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: '#BDBDBD',
    marginLeft: 8,
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 68,
  },
});
