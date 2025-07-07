/* eslint-disable prettier/prettier */
import { Ionicons } from '@expo/vector-icons';
import { View, Image, TouchableOpacity } from 'react-native';
import { ContentBlock } from 'types';

interface ImageBlockProps {
  block: ContentBlock;
  onDelete: (id: string) => void;
}

export function ImageBlock({ block, onDelete }: ImageBlockProps) {
  return (
    <View className="relative py-2">
      <View className="h-48 w-48 overflow-hidden">
        <Image source={{ uri: block.props.uri }} className="h-full w-full" resizeMode="cover" />
        <TouchableOpacity
          className="absolute right-2 top-2 rounded-full bg-black/50 p-1"
          onPress={() => onDelete(block.id)}
        >
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
