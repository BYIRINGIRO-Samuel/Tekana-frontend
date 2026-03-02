import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView, TextInput, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  initials: string;
}

const DEFAULT_CONTACTS: TrustedContact[] = [];

const ContactCard = ({ contact, onDelete }: { contact: TrustedContact, onDelete: (id: string) => void }) => (
  <TouchableOpacity 
    activeOpacity={0.7}
    onLongPress={() => onDelete(contact.id)}
    className="bg-brand-muted mb-4 p-5 rounded-xl border border-gray-800 flex-row items-center"
  >
    <View className="w-14 h-14 rounded-lg bg-brand-green/10 border border-brand-green/30 items-center justify-center mr-4">
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

export default function TrustedPeopleScreen({ navigate, goBack }: { navigate: (screen: string) => void, goBack: () => void }) {
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(DEFAULT_CONTACTS);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      loadContacts(currentUser?.id);
    };
    init();
  }, []);

  const loadContacts = async (userId?: string) => {
    if (!userId) return;
    try {
      const response = await userService.getTrustedContacts(userId);
      const contacts = response.map((contact: any) => ({
        ...contact,
        initials: contact.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
      }));
      setTrustedContacts(contacts);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  // Removed saveContacts as we're using API directly

  // Function to add contact from AddPersonScreen
  const addContact = async (contact: Omit<TrustedContact, 'id' | 'initials'>) => {
    if (!user?.id) return;
    try {
      await userService.addTrustedContact(user.id, contact);
      loadContacts(user.id);
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!user?.id) return;
    try {
      await userService.removeTrustedContact(user.id, id);
      loadContacts(user.id);
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const handleSave = async () => {
    if (!name || !phone || !relationship || !user?.id) return;

    setLoading(true);
    try {
      await userService.addTrustedContact(user.id, { name, phone, relationship });
      loadContacts(user.id);
      setIsAdding(false);
      setName('');
      setPhone('');
      setRelationship('');
    } catch (error) {
      console.error('Failed to save contact:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isAdding) {
    return (
      <SafeAreaView className="flex-1 bg-brand-dark px-6">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-row justify-between items-center py-6">
            <TouchableOpacity onPress={() => setIsAdding(false)} className="w-12 h-12 bg-brand-muted rounded-lg border border-gray-800 items-center justify-center">
              <Text className="text-white text-xl">←</Text>
            </TouchableOpacity>
            <Text className="text-white text-2xl font-black">Add Trusted Person</Text>
            <View className="w-12" />
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
            <View className="py-6 space-y-6">
              <View>
                <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Full Name</Text>
                <TextInput placeholder="Name" placeholderTextColor="#444" value={name} onChangeText={setName} className="bg-brand-muted h-16 rounded-lg px-5 text-white border border-gray-800 focus:border-brand-green" />
              </View>
              <View>
                <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Phone Number</Text>
                <TextInput placeholder="+250 ..." placeholderTextColor="#444" value={phone} onChangeText={setPhone} className="bg-brand-muted h-16 rounded-lg px-5 text-white border border-gray-800 focus:border-brand-green" keyboardType="phone-pad" />
              </View>
              <View>
                <Text className="text-brand-green text-xs font-bold uppercase mb-2 ml-1">Relationship</Text>
                <View className="flex-row flex-wrap gap-2">
                  {['Family', 'Friend', 'Work', 'Other'].map((type) => {
                    const isSelected = relationship === type;
                    return (
                      <TouchableOpacity key={type} onPress={() => setRelationship(type)} style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: isSelected ? '#A2D149' : '#666', backgroundColor: isSelected ? '#A2D149' : '#333' }}>
                        <Text style={{ fontWeight: 'bold', color: isSelected ? '#0D0D0D' : '#999' }}>{type}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </ScrollView>
          <View className="pb-8">
            <TouchableOpacity onPress={handleSave} disabled={!name || !phone || !relationship || loading} activeOpacity={0.7} style={{ height: 64, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: (!name || !phone || !relationship || loading) ? '#666' : '#A2D149', opacity: (!name || !phone || !relationship || loading) ? 0.5 : 1 }}>
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

  return (
    <SafeAreaView className="flex-1 bg-brand-dark px-6">
      <View className="flex-row justify-between items-center py-6">
        <TouchableOpacity 
          onPress={goBack}
          className="w-12 h-12 bg-brand-muted rounded-lg border border-gray-800 items-center justify-center"
        >
          <Text className="text-white text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-black">Trusted Circle</Text>
        <TouchableOpacity 
          onPress={() => setIsAdding(true)}
          className="w-12 h-12 bg-brand-green rounded-lg items-center justify-center"
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
        onPress={() => setIsAdding(true)}
        className="bg-brand-muted p-6 rounded-xl border border-dashed border-gray-700 items-center justify-center mb-6"
      >
        <Text className="text-gray-400 font-bold">Add New Trusted Person</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
