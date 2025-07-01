/* eslint-disable prettier/prettier */
import { Ionicons } from '@expo/vector-icons';
import { View, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { ContentBlock } from 'types';

interface ChecklistBlockProps {
  block: ContentBlock;
  onUpdate: (block: ContentBlock) => void;
}

export function ChecklistBlock({ block, onUpdate }: ChecklistBlockProps) {
  const colorScheme = useColorScheme();

  const handleItemCheck = (itemId: string) => {};
  const handleItemChangeText = (itemId: string, text: string) => {};

  return (
    <View>
      {block.props.items!.map((item, index) => (
        <View className="flex-row items-center p-2">
          <TouchableOpacity onPress={() => handleItemCheck(item.id)}>
            <Ionicons
              name={item.checked ? 'checkbox' : 'square-outline'}
              size={24}
              color={colorScheme === 'dark' ? 'white' : 'black'}
            />
          </TouchableOpacity>
          <TextInput
            className={`ml-2 flex-1 ${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'}`}
            value={item.text}
            // autoFocus={autoFocus}
            placeholder="Checklist item"
            onChangeText={(text) => handleItemChangeText(item.id, text)}
          />
        </View>
      ))}
    </View>
  );
}
