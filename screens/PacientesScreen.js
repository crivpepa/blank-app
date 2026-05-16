import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const PATIENTS = [
  {
    id: '1',
    name: 'María García Rodríguez',
    condition: 'Rehabilitación de rodilla',
    status: 'Activo',
    clinic: 'Clínica Norte',
    sessions: 12,
    lastVisit: '15 may 2026',
  },
  {
    id: '2',
    name: 'Carlos Martínez López',
    condition: 'Terapia física postoperatoria',
    status: 'En Tratamiento',
    clinic: 'Clínica Sur',
    sessions: 8,
    lastVisit: '14 may 2026',
  },
  {
    id: '3',
    name: 'Ana Sofía Pérez',
    condition: 'Lesión de hombro',
    status: 'Activo',
    clinic: 'Clínica Centro',
    sessions: 5,
    lastVisit: '13 may 2026',
  },
  {
    id: '4',
    name: 'Roberto Jiménez Vega',
    condition: 'Recuperación lumbar',
    status: 'Alta',
    clinic: 'Clínica Norte',
    sessions: 24,
    lastVisit: '02 may 2026',
  },
  {
    id: '5',
    name: 'Laura Sánchez Torres',
    condition: 'Fisioterapia neurológica',
    status: 'En Tratamiento',
    clinic: 'Clínica Sur',
    sessions: 18,
    lastVisit: '15 may 2026',
  },
  {
    id: '6',
    name: 'Miguel Ángel Flores',
    condition: 'Rehabilitación de cadera',
    status: 'Activo',
    clinic: 'Clínica Centro',
    sessions: 3,
    lastVisit: '16 may 2026',
  },
  {
    id: '7',
    name: 'Isabel Moreno Ruiz',
    condition: 'Terapia ocupacional',
    status: 'Alta',
    clinic: 'Clínica Norte',
    sessions: 30,
    lastVisit: '28 abr 2026',
  },
  {
    id: '8',
    name: 'Fernando Castro Díaz',
    condition: 'Lesión de tobillo',
    status: 'En Tratamiento',
    clinic: 'Clínica Sur',
    sessions: 7,
    lastVisit: '15 may 2026',
  },
];

const STATUS_CONFIG = {
  Activo: { color: '#4CAF50', bg: '#E8F5E9', icon: 'checkmark-circle' },
  'En Tratamiento': { color: '#FF9800', bg: '#FFF3E0', icon: 'time' },
  Alta: { color: '#2196F3', bg: '#E3F2FD', icon: 'star' },
};

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const AVATAR_COLORS = ['#2196F3', '#4CAF50', '#FF5722', '#9C27B0', '#FF9800', '#00BCD4', '#E91E63', '#607D8B'];

function PatientCard({ item, index }) {
  const status = STATUS_CONFIG[item.status] || STATUS_CONFIG['Activo'];
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
      </View>

      {/* Info */}
      <View style={styles.cardContent}>
        <View style={styles.cardTopRow}>
          <Text style={styles.patientName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon} size={10} color={status.color} style={{ marginRight: 3 }} />
            <Text style={[styles.statusText, { color: status.color }]}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.conditionText} numberOfLines={1}>
          <Ionicons name="medical-outline" size={12} color="#9E9E9E" /> {item.condition}
        </Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="business-outline" size={12} color="#BDBDBD" />
            <Text style={styles.metaText}>{item.clinic}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={12} color="#BDBDBD" />
            <Text style={styles.metaText}>{item.lastVisit}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="repeat-outline" size={12} color="#BDBDBD" />
            <Text style={styles.metaText}>{item.sessions} sesiones</Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#E0E0E0" />
    </TouchableOpacity>
  );
}

export default function PacientesScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filters = ['Todos', 'Activo', 'En Tratamiento', 'Alta'];

  const filtered = useMemo(() => {
    let list = PATIENTS;
    if (activeFilter !== 'Todos') {
      list = list.filter((p) => p.status === activeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.condition.toLowerCase().includes(q) ||
          p.clinic.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeFilter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Pacientes</Text>
          <Text style={styles.headerSub}>{PATIENTS.length} pacientes registrados</Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="filter-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search + Filters */}
      <View style={styles.searchArea}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#9E9E9E" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar paciente, condición..."
            placeholderTextColor="#BDBDBD"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#BDBDBD" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[styles.filterPillText, activeFilter === f && styles.filterPillTextActive]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <PatientCard item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={60} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptyText}>No se encontraron pacientes con ese criterio.</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  headerAction: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search Area
  searchArea: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterPillActive: {
    backgroundColor: '#FFFFFF',
  },
  filterPillText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#2196F3',
  },

  // List
  listContent: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardContent: {
    flex: 1,
    marginRight: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  conditionText: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: '#9E9E9E',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#BDBDBD',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 13,
    color: '#BDBDBD',
    marginTop: 6,
    textAlign: 'center',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 84,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
});
