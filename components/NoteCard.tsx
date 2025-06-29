/* eslint-disable prettier/prettier */
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { memo } from "react";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { useNotesStore } from "@/store/useNotesStore";
import { Note } from "@/types";

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
  return (
    <Swipeable renderRightActions={() => renderRightActions(note.id)}>
      <Link href={`/note/${note.id}` as any} asChild>
        <TouchableOpacity
          className={`border-b p-4 ${
            colorScheme === "dark" ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <Text
            className={`font-semibold ${colorScheme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            {note.title}
          </Text>
          <Text
            className={`text-sm ${colorScheme === "dark" ? "text-gray-400" : "text-gray-500"} mt-1`}
          >
            {note.title}
          </Text>
          <Text
            className={`text-xs ${colorScheme === "dark" ? "text-gray-500" : "text-gray-400"} mt-2`}
          >
            {note.updatedAt}
          </Text>
        </TouchableOpacity>
      </Link>
    </Swipeable>
  );
}

export default memo(NoteCard);
