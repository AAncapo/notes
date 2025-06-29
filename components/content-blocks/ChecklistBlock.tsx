/* eslint-disable prettier/prettier */
import { Ionicons } from "@expo/vector-icons";
import { View, TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { ContentBlock } from "types";

interface ChecklistBlockProps {
  block: ContentBlock;
  onUpdate: (block: ContentBlock) => void;
  autoFocus?: boolean;
}

export function ChecklistBlock({ block, onUpdate, autoFocus }: ChecklistBlockProps) {
  const colorScheme = useColorScheme();

  return (
    <View className="flex-row items-center bg-slate-400 p-2">
      <TouchableOpacity onPress={() => onUpdate({ ...block, checked: !block.checked })}>
        <Ionicons
          name={block.checked ? "checkbox" : "square-outline"}
          size={24}
          color={colorScheme === "dark" ? "white" : "black"}
        />
      </TouchableOpacity>
      <TextInput
        className={`ml-2 flex-1 ${colorScheme === "dark" ? "text-white" : "text-gray-800"}`}
        value={block.content}
        autoFocus={autoFocus}
        placeholder="Checklist item"
        onChangeText={(text) => onUpdate({ ...block, content: text })}
      />
    </View>
  );
}
