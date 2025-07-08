/* eslint-disable prettier/prettier */
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, useColorScheme, View, Platform, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NoteCard from '@/components/NoteCard';
import { useNotesStore } from '@/store/useNotesStore';
import { Note } from '@/types';
import { getIconColor } from '@/utils/utils';

export default function Notes() {
  const colorScheme = useColorScheme();
  const marginTop = useSafeAreaInsets().top;
  const notes = useNotesStore((state) => state.notes);
  const updateNote = useNotesStore((state) => state.updateNote);

  const filteredNotes = useMemo(() => {
    return notes;
  }, [notes]);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      // Pinned notes come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // If both are pinned or both not pinned, sort by updatedAt (newest first)
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [filteredNotes]);

  const renderNoteCard = useCallback(
    ({ item }: { item: Note }) => {
      return (
        <NoteCard
          key={item.id}
          note={item}
          handleLongPress={() => updateNote(item.id, { isPinned: !item.isPinned }, false)}
        />
      );
    },
    [sortedNotes]
  );

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="border-b border-slate-300 bg-white p-4 pb-10 pt-8" style={{ marginTop }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-7 text-4xl font-bold">Notes</Text>
          {Platform.OS === 'web' && <Text>(WEb)</Text>}
          <Ionicons name="settings-outline" size={20} color={getIconColor(colorScheme, true)} />
        </View>
        {/* <SearchBar onSubmit={addNote} /> */}
      </View>
      <View className="flex-1">
        <FlatList
          data={sortedNotes}
          renderItem={renderNoteCard}
          keyExtractor={(item) => item.id}
          alwaysBounceVertical
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow px-3"
        />
      </View>

      {/* FAB */}
      <Link href="/note/new" asChild>
        <TouchableOpacity
          activeOpacity={0.3}
          style={{
            shadowColor: 'black',
            shadowOffset: {
              width: 5,
              height: -5,
            },
            shadowOpacity: 0.5,
            shadowRadius: 5,
          }}
          className={`absolute bottom-20 h-20 w-20 items-center justify-center self-center rounded-full shadow-lg ${
            colorScheme === 'dark' ? 'bg-white' : 'bg-black'
          }`}
        >
          <Ionicons name="add" size={28} color={colorScheme === 'dark' ? 'black' : 'white'} />
        </TouchableOpacity>
      </Link>
    </GestureHandlerRootView>
  );
}
