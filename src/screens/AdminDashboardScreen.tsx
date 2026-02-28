import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Alert, SafeAreaView, Platform } from 'react-native';
import { userService } from '../services/userService';
import { incidentService } from '../services/incidentService';
import { authService } from '../services/authService';

export default function AdminDashboardScreen({ navigate }: { navigate: (screen: string) => void }) {
  const [activeTab, setActiveTab] = useState<'users' | 'incidents' | 'profile'>('users');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'incidents') {
      loadIncidents();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers();
      setData(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error('Failed to load users', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const res = await incidentService.getIncidents();
      setData(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error('Failed to load incidents', error);
      Alert.alert('Error', 'Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to end your admin session?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive', 
        onPress: async () => {
          await authService.logout();
          navigate('Intro');
        } 
      }
    ]);
  };

  const renderCurrentTab = () => {
    if (activeTab === 'profile') {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#A2D149', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 32, fontWeight: '900', color: '#000' }}>AD</Text>
          </View>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Admin User</Text>
          <Text style={{ color: 'gray', fontSize: 16, marginBottom: 40, marginTop: 4 }}>System Administrator</Text>

          <TouchableOpacity 
            onPress={handleLogout}
            style={{ backgroundColor: '#EF4444', width: '100%', padding: 20, borderRadius: 16, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Terminate Session</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {activeTab === 'users' ? 'User Directory' : 'Emergency Incidents'}
          </Text>
          <Text style={styles.subtitle}>
            {activeTab === 'users' ? 'Manage system access & roles' : 'Monitor active SOS alerts'}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A2D149" />
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            ListEmptyComponent={<Text style={{ color: 'gray', textAlign: 'center', marginTop: 40 }}>No data found.</Text>}
            renderItem={({ item }) => (
              activeTab === 'users' ? (
                <View style={styles.card}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.phone}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.role}</Text>
                    </View>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Text style={[styles.statusText, { color: item.isVerified ? '#A2D149' : '#EF4444' }]}>
                      {item.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: item.severity === 'HIGH' ? '#EF4444' : '#EAB308' }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: item.severity === 'HIGH' ? '#EF4444' : 'white' }]}>
                      {item.type.replace('_', ' ')}
                    </Text>
                    <Text style={styles.cardSubtitle}>Severity: {item.severity}</Text>
                    <Text style={[styles.cardSubtitle, { marginTop: 4, fontStyle: 'italic' }]}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Text style={[styles.statusText, { color: item.status === 'REPORTED' ? '#EF4444' : '#A2D149' }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              )
            )}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderCurrentTab()}

      {/* Stylish Bottom Bar */}
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            onPress={() => setActiveTab('users')}
            style={[styles.tabItem, activeTab === 'users' && styles.tabItemActive]}
          >
            <Text style={{ fontSize: 24, opacity: activeTab === 'users' ? 1 : 0.5 }}>👥</Text>
            {activeTab === 'users' && <Text style={styles.tabText}>Users</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab('incidents')}
            style={[styles.tabItem, activeTab === 'incidents' && styles.tabItemActive]}
          >
            <Text style={{ fontSize: 24, opacity: activeTab === 'incidents' ? 1 : 0.5 }}>🚨</Text>
            {activeTab === 'incidents' && <Text style={styles.tabText}>Alerts</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab('profile')}
            style={[styles.tabItem, activeTab === 'profile' && styles.tabItemActive]}
          >
            <Text style={{ fontSize: 24, opacity: activeTab === 'profile' ? 1 : 0.5 }}>⚙️</Text>
            {activeTab === 'profile' && <Text style={styles.tabText}>Admin</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { padding: 24, paddingBottom: 10 },
  headerTitle: { color: 'white', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: 'gray', marginTop: 4, fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#141414', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#222', flexDirection: 'row' },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  cardSubtitle: { color: '#888', fontSize: 13 },
  badge: { backgroundColor: 'rgba(162, 209, 73, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: 'rgba(162, 209, 73, 0.3)' },
  badgeText: { color: '#A2D149', fontSize: 10, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  statusText: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingTop: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    padding: 8,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  tabItemActive: {
    backgroundColor: '#2A2A2A',
  },
  tabText: {
    color: 'white',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 14,
  }
});
