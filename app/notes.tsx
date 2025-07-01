/* eslint-disable prettier/prettier */
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Text, TouchableOpacity, ScrollView, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NoteCard from '@/components/NoteCard';
import { useNotesStore } from '@/store/useNotesStore';

export default function Notes() {
  const colorScheme = useColorScheme();
  const { top } = useSafeAreaInsets();
  const notes = useNotesStore((state) => state.notes);
  return (
    <GestureHandlerRootView className="flex-1">
      <View className="border-b border-slate-300 bg-white p-10" style={{ marginTop: top }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-7 text-4xl font-bold">Notes</Text>
          <Ionicons name="settings-outline" size={20} />
        </View>
        {/* <SearchBar onSubmit={addNote} /> */}
      </View>
      <ScrollView className="flex-1">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </ScrollView>

      {/* FAB */}
      <Link href="/note/new" asChild>
        <TouchableOpacity
          className={`absolute bottom-20 h-20 w-20 items-center justify-center self-center rounded-full ${
            colorScheme === 'dark' ? 'bg-white' : 'bg-black'
          }`}
        >
          <Ionicons name="add" size={28} color={colorScheme === 'dark' ? 'black' : 'white'} />
        </TouchableOpacity>
      </Link>
    </GestureHandlerRootView>
  );
}
