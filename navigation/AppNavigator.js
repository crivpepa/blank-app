import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import PacientesScreen from '../screens/PacientesScreen';
import FamiliasScreen from '../screens/FamiliasScreen';
import ClinicasScreen from '../screens/ClinicasScreen';

const Tab = createBottomTabNavigator();

const PRIMARY = '#2196F3';
const INACTIVE = '#9E9E9E';
const TAB_BG = '#FFFFFF';

function TabIcon({ name, focused, size }) {
  return (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={size}
      color={focused ? PRIMARY : INACTIVE}
    />
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: { marginTop: 4 },
        tabBarItemStyle: styles.tabItem,
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused, size }) => (
            <TabIcon name="home" focused={focused} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Pacientes"
        component={PacientesScreen}
        options={{
          tabBarLabel: 'Pacientes',
          tabBarIcon: ({ focused, size }) => (
            <TabIcon name="people" focused={focused} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Familias"
        component={FamiliasScreen}
        options={{
          tabBarLabel: 'Familias',
          tabBarIcon: ({ focused, size }) => (
            <TabIcon name="heart" focused={focused} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Clínicas"
        component={ClinicasScreen}
        options={{
          tabBarLabel: 'Clínicas',
          tabBarIcon: ({ focused, size }) => (
            <TabIcon name="business" focused={focused} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: TAB_BG,
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarBackground: {
    flex: 1,
    backgroundColor: TAB_BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabItem: {
    borderRadius: 12,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
});
