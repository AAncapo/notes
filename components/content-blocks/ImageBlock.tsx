/* eslint-disable prettier/prettier */
import { Ionicons } from "@expo/vector-icons";
import { View, Image, TouchableOpacity, useColorScheme } from "react-native";
import { ContentBlock } from "types";

interface ImageBlockProps {
  block: ContentBlock;
  onDelete: () => void;
}

export function ImageBlock({ block, onDelete }: ImageBlockProps) {
  const colorScheme = useColorScheme();

  return (
    <View className="relative p-2">
      <View className="h-48 w-48 overflow-hidden rounded-lg">
        <Image source={{ uri: block.uri }} className="h-full w-full" resizeMode="cover" />
      </View>
      <TouchableOpacity
        className="absolute right-2 top-2 rounded-full bg-black/50 p-1"
        onPress={onDelete}
      >
        <Ionicons name="close" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
