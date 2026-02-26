import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  initials: string;
}

const DEFAULT_CONTACTS: TrustedContact[] = [
  { id: '1', name: 'Darcy Wales', phone: '+250 724 524 524', initials: 'DW', relationship: 'Primary' },
  { id: '2', name: 'John Doe', phone: '+250 079 544 545', initials: 'JD', relationship: 'Secondary' },
  { id: '3', name: 'Jane Doe', phone: '+250 738 899 988', initials: 'JD', relationship: 'Family' },
];

const ContactCard = ({ contact, onDelete }: { contact: TrustedContact, onDelete: (id: string) => void }) => (
  <TouchableOpacity 
    activeOpacity={0.7}
    onLongPress={() => onDelete(contact.id)}
    className="bg-brand-muted mb-4 p-5 rounded-[28px] border border-gray-800 flex-row items-center"
  >
    <View className="w-14 h-14 rounded-2xl bg-brand-green/10 border border-brand-green/30 items-center justify-center mr-4">
      <Text className="text-brand-green font-black text-xl">{contact.initials}</Text>
    </View>
    <View className="flex-1">
      <Text className="text-white font-bold text-lg mb-1">{contact.name}</Text>
      <Text className="text-gray-500 font-medium text-sm">{contact.phone}</Text>
    </View>
    <View className="bg-brand-green/20 px-3 py-1 rounded-full border border-brand-green/20">
      <Text className="text-brand-green text-[10px] font-black uppercase tracking-widest">{contact.relationship}</Text>
    </View>
  </TouchableOpacity>
);

export default function TrustedPeopleScreen() {
  const navigation = useNavigation<any>();
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(DEFAULT_CONTACTS);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const stored = await AsyncStorage.getItem('trusted_contacts');
      if (stored) {
        setTrustedContacts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const saveContacts = async (contacts: TrustedContact[]) => {
    try {
      await AsyncStorage.setItem('trusted_contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Failed to save contacts:', error);
    }
  };

  // Function to add contact from AddPersonScreen
  const addContact = (contact: Omit<TrustedContact, 'id'>) => {
    const newContact: TrustedContact = {
      ...contact,
      id: Date.now().toString(),
    };
    const updated = [...trustedContacts, newContact];
    setTrustedContacts(updated);
    saveContacts(updated);
  };

  const deleteContact = (id: string) => {
    const updated = trustedContacts.filter(c => c.id !== id);
    setTrustedContacts(updated);
    saveContacts(updated);
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-dark px-6">
      <View className="flex-row justify-between items-center py-6">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-12 h-12 bg-brand-muted rounded-2xl border border-gray-800 items-center justify-center"
        >
          <Text className="text-white text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-black">Trusted Circle</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AddPerson')}
          className="w-12 h-12 bg-brand-green rounded-2xl items-center justify-center"
        >
          <Text className="text-brand-dark text-2xl font-black">+</Text>
        </TouchableOpacity>
      </View>
      <View className="mb-8">
        <Text className="text-gray-500 text-lg leading-relaxed">
          These people will be notified immediately when you trigger an <Text className="text-brand-green font-bold">SOS</Text> alert.
        </Text>
      </View>
      <FlatList 
        data={trustedContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactCard contact={item} onDelete={deleteContact} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <TouchableOpacity 
        onPress={() => navigation.navigate('AddPerson')}
        className="bg-brand-muted p-6 rounded-[32px] border border-dashed border-gray-700 items-center justify-center mb-6"
      >
        <Text className="text-gray-400 font-bold">Add New Trusted Person</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
