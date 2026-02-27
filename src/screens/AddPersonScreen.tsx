import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddPersonScreen({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    if (!name || !phone || !relationship) return;

    setLoading(true);
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newContact = {
      id: Date.now().toString(),
      name,
      phone,
      relationship,
      initials,
    };

    try {
      const stored = await AsyncStorage.getItem('trusted_contacts');
      const contacts = stored ? JSON.parse(stored) : [];
      contacts.push(newContact);
      await AsyncStorage.setItem('trusted_contacts', JSON.stringify(contacts));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save contact:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-brand-dark px-6">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-row justify-between items-center py-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-12 h-12 bg-brand-muted rounded-2xl border border-gray-800 items-center justify-center">
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-2xl font-black">Add Trusted Person</Text>
          <View className="w-12" />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View className="py-6 space-y-6">
            <View>
              <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Full Name</Text>
              <TextInput placeholder="Name" placeholderTextColor="#444" value={name} onChangeText={setName} className="bg-brand-muted h-16 rounded-2xl px-5 text-white border border-gray-800 focus:border-brand-green" />
            </View>
            <View>
              <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Phone Number</Text>
              <TextInput placeholder="+250 ..." placeholderTextColor="#444" value={phone} onChangeText={setPhone} className="bg-brand-muted h-16 rounded-2xl px-5 text-white border border-gray-800 focus:border-brand-green" keyboardType="phone-pad" />
            </View>
            <View>
              <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Relationship</Text>
              <View className="flex-row flex-wrap gap-2">
                {['Family', 'Friend', 'Work', 'Other'].map((type) => {
                  const isSelected = relationship === type;
                  return (
                    <TouchableOpacity key={type} onPress={() => { console.log('Selected:', type); setRelationship(type); }} className={`px-6 py-3 rounded-full border ${isSelected ? 'bg-brand-green border-brand-green' : 'bg-brand-muted border-gray-800'}`}>
                      <Text className={`font-bold ${isSelected ? 'text-brand-dark' : 'text-gray-500'}`}>{type}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>
        <View className="pb-8">
          <TouchableOpacity onPress={handleSave} disabled={!name || !phone || !relationship || loading} activeOpacity={0.7} className={`h-16 rounded-2xl items-center justify-center ${(!name || !phone || !relationship || loading) ? 'bg-gray-800 opacity-50' : 'bg-brand-green shadow-xl shadow-brand-green/20'}`}>
            {loading ? (
              <ActivityIndicator size="small" color="#0D0D0D" />
            ) : (
              <Text className={`text-xl font-bold ${(!name || !phone || !relationship) ? 'text-gray-500' : 'text-brand-dark'}`}>Save Person</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
