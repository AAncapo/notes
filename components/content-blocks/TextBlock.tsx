/* eslint-disable prettier/prettier */
import { TextInput, useColorScheme } from "react-native";
import { ContentBlock } from "types";

interface TextBlockProps {
  block: ContentBlock;
  onUpdate: (block: ContentBlock) => void;
  autoFocus?: boolean;
}

export function TextBlock({ block, onUpdate, autoFocus }: TextBlockProps) {
  const colorScheme = useColorScheme();

  return (
    <TextInput
      className={`flex-1 p-2 ${colorScheme === "dark" ? "text-white" : "text-gray-800"} bg-blue-500`}
      multiline
      autoFocus={autoFocus}
      value={block.content}
      onChangeText={(text) => onUpdate({ ...block, content: text })}
    />
  );
}
