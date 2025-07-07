/* eslint-disable prettier/prettier */
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { memo, useMemo } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { useNotesStore } from '@/store/useNotesStore';
import { ContentType, Note } from '@/types';
import { convertAndFormatUTC } from '@/utils/utils';

interface NoteCardProps {
  note: Note;
}

function NoteCard({ note }: NoteCardProps) {
  const colorScheme = useColorScheme();

  const handleDelete = (id: string) => {
    useNotesStore.getState().deleteNote(id);
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        className="w-20 items-center justify-center bg-red-500"
        onPress={() => handleDelete(id)}
      >
        <Ionicons name="trash" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const renderSubtitle = useMemo(() => {
    const cblock = note.content.length > 0 ? note.content[0] : null;
    switch (cblock?.type) {
      case ContentType.TEXT:
        return cblock.props.text;
      case ContentType.AUDIO:
        return cblock.props.title || 'Audio';
      case ContentType.IMAGE:
        return 'Imagen';
      default:
        return '???';
    }
    // <MaterialIcons name="music-note" size={24} color="black" />;
  }, []);

  const updatedAt = convertAndFormatUTC(note.updatedAt);

  return (
    <Swipeable renderRightActions={() => renderRightActions(note.id)}>
      <Link href={`/note/${note.id}` as any} asChild>
        <TouchableOpacity
          className={`p-4 py-2 ${colorScheme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}
        >
          <Text
            className={`font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} flex text-ellipsis`}
            numberOfLines={1}
          >
            {note.title === '' ? renderSubtitle : note.title}
          </Text>
          <Text
            className={`text-sm ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1 flex text-ellipsis`}
            numberOfLines={2}
          >
            {renderSubtitle}
          </Text>
          <Text
            className={`text-xs ${colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-2 line-clamp-1 overflow-clip`}
          >
            {updatedAt}
          </Text>
        </TouchableOpacity>
      </Link>
      <View className="h-[1px] w-11/12 self-center rounded-full bg-gray-200" />
    </Swipeable>
  );
}

export default memo(NoteCard);
