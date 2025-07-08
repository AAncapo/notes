/* eslint-disable prettier/prettier */
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ColorSchemeName, TextInput, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  colorScheme: ColorSchemeName;
  title: string;
  updateTitle: (title: string) => void;
  submitTitle: () => void;
  onBack: () => void;
  onMain: () => void;
}

function NoteHeader({ title, updateTitle, submitTitle, colorScheme, onBack, onMain }: HeaderProps) {
  return (
    <View
      className={`flex-row items-center justify-between border-b p-4 ${
        colorScheme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      }`}
    >
      {/* Back */}
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>
      {/* Title */}
      <TextInput
        className={`mx-4 flex-1 text-center text-xl font-bold ${
          colorScheme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}
        defaultValue={title}
        onChangeText={updateTitle}
        placeholder="Añade un título"
        onSubmitEditing={submitTitle}
      />
      <TouchableOpacity onPress={onMain}>
        <MaterialCommunityIcons
          name="tag-plus-outline"
          size={24}
          color={colorScheme === 'dark' ? 'white' : 'black'}
        />
      </TouchableOpacity>
    </View>
  );
}

export default NoteHeader;
