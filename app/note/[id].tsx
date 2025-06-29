/* eslint-disable prettier/prettier */
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AudioRecordingModal } from "@/components/AudioRecordingModal";
import { AudioBlock } from "@/components/content-blocks/AudioBlock";
import { ChecklistBlock } from "@/components/content-blocks/ChecklistBlock";
import { ImageBlock } from "@/components/content-blocks/ImageBlock";
import { TextBlock } from "@/components/content-blocks/TextBlock";
import { useNotesStore } from "@/store/useNotesStore";
import { ContentBlock, ContentType } from "@/types";

export default function NoteDetails() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNewNote = !id || id === "new";
  const { getNote, addNote, updateNote } = useNotesStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [isRecordingModalVisible, setIsRecordingModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!isNewNote) {
      const existingNote = getNote(id);
      if (existingNote) {
        setTitle(existingNote.title);
        setContent(existingNote.content);
      }
    }
  }, [isNewNote, getNote]);

  const handleSave = () => {
    if (!isNewNote) {
      updateNote(id as string, { title, content });
    } else {
      addNote({ title, content });
    }
    router.back();
  };

  const handleAddTextBlock = () => {
    // Only add if there's no content or the last block isn't empty
    if (
      content.length === 0 ||
      content[content.length - 1].type !== "text" ||
      content[content.length - 1].content !== ""
    ) {
      const newBlock = {
        id: Date.now().toString(),
        type: ContentType.TEXT,
        content: "",
      };

      setContent([...content, newBlock]);
    }
  };

  const handleAddChecklist = () => {
    const newContent = [...content];
    newContent.push({
      id: Date.now().toString(),
      type: ContentType.CHECKLIST,
      content: "",
      checked: false,
    });
    setContent(newContent);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const newContent = [...content];
      newContent.push({
        id: Date.now().toString(),
        type: ContentType.IMAGE,
        content: "Image",
        uri: result.assets[0].uri,
      });
      setContent(newContent);
    }
  };

  const handleSaveRecording = (uri: string, duration: number) => {
    const newContent = [...content];
    newContent.push({
      id: Date.now().toString(),
      type: ContentType.AUDIO,
      content: "Audio recording",
      uri,
      duration: duration * 1000, // Convert to milliseconds
    });
    setContent(newContent);
    setIsRecordingModalVisible(false);
  };

  const handleUpdateBlock = (updatedBlock: ContentBlock) => {
    const newContent = content.map((block) =>
      block.id === updatedBlock.id ? updatedBlock : block,
    );
    setContent(newContent);
  };

  const handleDeleteBlock = (blockId: string) => {
    const newContent = content.filter((block) => block.id !== blockId);
    setContent(newContent);
  };

  const renderContentBlock = useCallback(
    (block: ContentBlock) => {
      switch (block.type) {
        case "text":
          // eslint-disable-next-line no-case-declarations
          const autoFocus = content[content.length - 1].id === block.id;
          return (
            <TextBlock
              key={block.id}
              block={block}
              onUpdate={handleUpdateBlock}
              autoFocus={autoFocus}
            />
          );

        case "checklist":
          return <ChecklistBlock key={block.id} block={block} onUpdate={handleUpdateBlock} />;
        case "image":
          return (
            <ImageBlock key={block.id} block={block} onDelete={() => handleDeleteBlock(block.id)} />
          );
        case "audio":
          return (
            <AudioBlock key={block.id} block={block} onDelete={() => handleDeleteBlock(block.id)} />
          );
      }
    },
    [content],
  );

  return (
    <SafeAreaView className={`flex-1 ${colorScheme === "dark" ? "bg-black" : "bg-white"}`}>
      {/* Header */}
      <View
        className={`flex-row items-center justify-between border-b p-4 ${
          colorScheme === "dark" ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
        <TextInput
          className={`mx-4 flex-1 text-xl font-bold ${
            colorScheme === "dark" ? "text-white" : "text-gray-800"
          }`}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
        />
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="checkmark" size={24} color={colorScheme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable className="flex-1 bg-red-500" onPress={handleAddTextBlock}>
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 80 }}
            // keyboardShouldPersistTaps="handled"
          >
            {content.map((block) => renderContentBlock(block))}
          </ScrollView>
        </Pressable>
      </KeyboardAvoidingView>

      {/* Toolbar */}
      <View
        className={`absolute bottom-0 left-0 right-0 flex-row justify-around border-t p-4 ${
          colorScheme === "dark" ? "border-gray-800 bg-black" : "border-gray-200 bg-white"
        }`}
      >
        <TouchableOpacity onPress={handleAddChecklist}>
          <Ionicons name="list" size={24} color={colorScheme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsRecordingModalVisible(true)}>
          <Ionicons name="mic" size={24} color={colorScheme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickImage}>
          <Ionicons name="image" size={24} color={colorScheme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
      </View>

      <AudioRecordingModal
        visible={isRecordingModalVisible}
        onClose={() => setIsRecordingModalVisible(false)}
        onSave={handleSaveRecording}
      />
    </SafeAreaView>
  );
}
