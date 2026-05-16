import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const FAMILIES = [
  {
    id: '1',
    familyName: 'Familia García Rodríguez',
    contact: 'Carlos García',
    members: 4,
    patients: 2,
    clinic: 'Clínica Norte',
    status: 'Activa',
    phone: '+52 55 1234-5678',
    since: 'Ene 2025',
  },
  {
    id: '2',
    familyName: 'Familia Martínez López',
    contact: 'Rosa Martínez',
    members: 3,
    patients: 1,
    clinic: 'Clínica Sur',
    status: 'Activa',
    phone: '+52 55 2345-6789',
    since: 'Mar 2025',
  },
  {
    id: '3',
    familyName: 'Familia Pérez Sánchez',
    contact: 'Javier Pérez',
    members: 5,
    patients: 3,
    clinic: 'Clínica Centro',
    status: 'En Seguimiento',
    phone: '+52 55 3456-7890',
    since: 'Feb 2025',
  },
  {
    id: '4',
    familyName: 'Familia Jiménez Torres',
    contact: 'Elena Jiménez',
    members: 2,
    patients: 1,
    clinic: 'Clínica Norte',
    status: 'Activa',
    phone: '+52 55 4567-8901',
    since: 'Abr 2025',
  },
  {
    id: '5',
    familyName: 'Familia Flores Vega',
    contact: 'Antonio Flores',
    members: 6,
    patients: 2,
    clinic: 'Clínica Sur',
    status: 'En Seguimiento',
    phone: '+52 55 5678-9012',
    since: 'Dic 2024',
  },
  {
    id: '6',
    familyName: 'Familia Castro Moreno',
    contact: 'Lucía Castro',
    members: 3,
    patients: 1,
    clinic: 'Clínica Centro',
    status: 'Activa',
    phone: '+52 55 6789-0123',
    since: 'May 2025',
  },
];

const STATUS_CONFIG = {
  Activa: { color: '#4CAF50', bg: '#E8F5E9', icon: 'checkmark-circle' },
  'En Seguimiento': { color: '#FF9800', bg: '#FFF3E0', icon: 'time' },
};

const FAMILY_COLORS = ['#2196F3', '#9C27B0', '#FF5722', '#4CAF50', '#FF9800', '#00BCD4'];

function getInitials(name) {
  // e.g. "Familia García Rodríguez" -> "GR"
  const words = name.replace('Familia ', '').split(' ');
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function FamilyCard({ item, index }) {
  const status = STATUS_CONFIG[item.status] || STATUS_CONFIG['Activa'];
  const color = FAMILY_COLORS[index % FAMILY_COLORS.length];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Ionicons name="people" size={22} color="#FFFFFF" />
      </View>

      {/* Info */}
      <View style={styles.cardContent}>
        <View style={styles.cardTopRow}>
          <Text style={styles.familyName} numberOfLines={1}>
            {item.familyName}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon} size={10} color={status.color} style={{ marginRight: 3 }} />
            <Text style={[styles.statusText, { color: status.color }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <Ionicons name="person-outline" size={12} color="#9E9E9E" />
          <Text style={styles.contactText}>{item.contact}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Ionicons name="people-outline" size={12} color={color} />
            <Text style={[styles.statChipText, { color }]}>{item.members} miembros</Text>
          </View>
          <View style={styles.statChip}>
            <Ionicons name="medical-outline" size={12} color={color} />
            <Text style={[styles.statChipText, { color }]}>{item.patients} paciente{item.patients !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        {/* Meta */}
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="business-outline" size={11} color="#BDBDBD" />
            <Text style={styles.metaText}>{item.clinic}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="call-outline" size={11} color="#BDBDBD" />
            <Text style={styles.metaText}>{item.phone}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={11} color="#BDBDBD" />
            <Text style={styles.metaText}>Desde {item.since}</Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#E0E0E0" />
    </TouchableOpacity>
  );
}

export default function FamiliasScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todas');

  const filters = ['Todas', 'Activa', 'En Seguimiento'];

  const filtered = useMemo(() => {
    let list = FAMILIES;
    if (activeFilter !== 'Todas') {
      list = list.filter((f) => f.status === activeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (f) =>
          f.familyName.toLowerCase().includes(q) ||
          f.contact.toLowerCase().includes(q) ||
          f.clinic.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeFilter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Familias</Text>
          <Text style={styles.headerSub}>{FAMILIES.length} familias vinculadas</Text>
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
            placeholder="Buscar familia, contacto, clínica..."
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

        <View style={styles.filterRow}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterPillText, activeFilter === f && styles.filterPillTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary Banner */}
      <View style={styles.summaryBanner}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{FAMILIES.reduce((a, f) => a + f.members, 0)}</Text>
          <Text style={styles.summaryLabel}>Miembros</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{FAMILIES.reduce((a, f) => a + f.patients, 0)}</Text>
          <Text style={styles.summaryLabel}>Pacientes</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{FAMILIES.filter((f) => f.status === 'Activa').length}</Text>
          <Text style={styles.summaryLabel}>Activas</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <FamilyCard item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={60} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptyText}>No se encontraron familias con ese criterio.</Text>
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

  // Search
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

  // Summary Banner
  summaryBanner: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  avatarText: {
    fontSize: 15,
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
    marginBottom: 4,
  },
  familyName: {
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
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 12,
    color: '#757575',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statChipText: {
    fontSize: 11,
    fontWeight: '600',
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
