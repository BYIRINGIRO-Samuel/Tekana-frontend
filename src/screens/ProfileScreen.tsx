import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';
import api from '../services/api';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface UserProfile {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: string;
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export default function ProfileScreen({ navigate, goBack }: { navigate: (screen: string) => void, goBack?: () => void }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data.user);
    } catch (error) {
      console.error('Profile load error:', error);
      Alert.alert('Error', 'Failed to load profile');
      const userData = await authService.getCurrentUser();
      if (userData) {
        setProfile(userData);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
            onPress: async () => {
              try {
                await authService.logout();
                navigate('Intro');
              } catch (error) {
                console.error('Logout error:', error);
                navigate('Intro');
              }
            },
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A2D149" />
          <Text style={styles.loadingText}>Loading Profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={goBack}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {profile && (
          <Animated.View entering={FadeInUp.duration(600)} style={styles.content}>
            {/* User Avatar and Basic Info */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
                </View>
                <View style={[styles.verificationBadge, { backgroundColor: profile.isVerified ? '#A2D149' : '#EF4444' }]}>
                  <Text style={styles.verificationText}>{profile.isVerified ? '✓' : '!'}</Text>
                </View>
              </View>
              <Text style={styles.userName}>{profile.name}</Text>
              <Text style={styles.userRole}>{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</Text>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </Text>
                <Text style={styles.statLabel}>Days Active</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {profile.lastLoginAt ? Math.floor((Date.now() - new Date(profile.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'}
                </Text>
                <Text style={styles.statLabel}>Days Since Login</Text>
              </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>📱 Phone</Text>
                <Text style={styles.infoValue}>{profile.phone}</Text>
              </View>

              {profile.email && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>✉️ Email</Text>
                  <Text style={styles.infoValue}>{profile.email}</Text>
                </View>
              )}

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>📅 Member Since</Text>
                <Text style={styles.infoValue}>{formatDate(profile.createdAt)}</Text>
              </View>

              {profile.lastLoginAt && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>🔑 Last Login</Text>
                  <Text style={styles.infoValue}>{formatDate(profile.lastLoginAt)}</Text>
                </View>
              )}
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  onPress={() => navigate('TrustedPeople')}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionIcon}>👥</Text>
                  <Text style={styles.actionText}>Trusted People</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => navigate('Vault')}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionIcon}>🛡️</Text>
                  <Text style={styles.actionText}>Secure Vault</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#A2D149',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#A2D149',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A2D149',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    color: '#0D0D0D',
    fontSize: 32,
    fontWeight: '900',
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0D0D0D',
  },
  verificationText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
  },
  userRole: {
    color: '#A2D149',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statNumber: {
    color: '#A2D149',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 4,
  },
  statLabel: {
    color: '#CCC',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  infoItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoLabel: {
    color: '#A2D149',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
