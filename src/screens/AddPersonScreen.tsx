import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function AddPersonScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const handleSave = () => {
    if (!name || !phone || !relationship) return;

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newContact = {
      name,
      phone,
      relationship,
      initials,
    };

    // Navigate back with params
    navigation.navigate('TrustedPeople', { newContact });
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
                {['Family', 'Friend', 'Work', 'Other'].map((type) => (
                  <TouchableOpacity key={type} onPress={() => setRelationship(type)} className={`px-6 py-3 rounded-full border ${relationship === type ? 'bg-brand-green border-brand-green' : 'bg-brand-muted border-gray-800'}`}>
                    <Text className={`font-bold ${relationship === type ? 'text-brand-dark' : 'text-gray-500'}`}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
        <View className="pb-8">
          <TouchableOpacity onPress={handleSave} disabled={!name || !phone || !relationship} activeOpacity={0.7} className={`h-16 rounded-2xl items-center justify-center ${(!name || !phone || !relationship) ? 'bg-gray-800 opacity-50' : 'bg-brand-green shadow-xl shadow-brand-green/20'}`}>
            <Text className={`text-xl font-bold ${(!name || !phone || !relationship) ? 'text-gray-500' : 'text-brand-dark'}`}>Save Person</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
