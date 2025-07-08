/* eslint-disable prettier/prettier */
import { Ionicons } from '@expo/vector-icons';
import { ColorSchemeName, TouchableOpacity, View } from 'react-native';

import { ContentType } from '@/types';
import { getIconColor } from '@/utils/utils';

interface ToolbarProps {
  colorScheme: ColorSchemeName;
  onOptionSelected: (type: ContentType) => void;
}

function NoteToolbar({ colorScheme, onOptionSelected }: ToolbarProps) {
  return (
    <View
      className={`h-16 flex-row items-center justify-around border-t p-4 py-0 ${
        colorScheme === 'dark' ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'
      }`}
    >
      <TouchableOpacity
        disabled
        activeOpacity={0.2}
        className="h-full flex-1 items-center justify-center"
        onPress={() => onOptionSelected(ContentType.CHECKLIST)}
      >
        <Ionicons name="list" size={24} color={getIconColor(colorScheme, true)} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.2}
        className="h-full flex-1 items-center justify-center"
        onPress={() => onOptionSelected(ContentType.AUDIO)}
      >
        <Ionicons name="mic" size={24} color={getIconColor(colorScheme)} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.2}
        className="h-full flex-1 items-center justify-center"
        onPress={() => onOptionSelected(ContentType.IMAGE)}
      >
        <Ionicons name="image" size={24} color={getIconColor(colorScheme)} />
      </TouchableOpacity>
    </View>
  );
}

export default NoteToolbar;
