/* eslint-disable prettier/prettier */
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { memo, useMemo } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { useNotesStore } from '@/store/useNotesStore';
import { ContentType, Note } from '@/types';
import { convertAndFormatUTC } from '@/utils/utils';

interface NoteCardProps {
  note: Note;
  handleLongPress: () => void;
}

function NoteCard({ note, handleLongPress }: NoteCardProps) {
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
    if (!cblock) return '[EMPTY]';
    switch (cblock?.type) {
      case ContentType.TEXT:
        return cblock.props.text !== '' ? cblock.props.text : '<empty>';
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
          className={`relative py-1 ${colorScheme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}
          onLongPress={handleLongPress}
        >
          {/* Title */}
          <Text
            className={`font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} flex text-ellipsis`}
            numberOfLines={1}
          >
            {note.title === '' ? renderSubtitle : note.title}
          </Text>
          {/* Subtitle */}
          <Text
            className={`text-sm ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} flex text-ellipsis`}
            numberOfLines={2}
          >
            {renderSubtitle}
          </Text>
          {/* UpdatedAt */}
          <Text
            className={`py-1 text-xs ${colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-400'} line-clamp-1 overflow-clip`}
          >
            {updatedAt}
          </Text>
          {note.isPinned && (
            <View className="absolute right-0 top-2">
              <MaterialCommunityIcons name="pin-outline" size={20} color="black" />
            </View>
          )}
        </TouchableOpacity>
      </Link>
      <View className="h-[1px] w-full self-center rounded-full bg-gray-200" />
    </Swipeable>
  );
}

export default memo(NoteCard);
