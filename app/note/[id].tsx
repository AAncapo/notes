/* eslint-disable prettier/prettier */
/* eslint-disable no-case-declarations */
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  FlatList,
  BackHandler,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AudioRecordingModal } from '@/components/AudioRecordingModal';
import BlockOptionsModal from '@/components/BlockOptionsModal';
import NoteHeader from '@/components/NoteHeader';
import NoteToolbar from '@/components/NoteToolbar';
import { AudioBlock } from '@/components/content-blocks/AudioBlock';
import { ChecklistBlock } from '@/components/content-blocks/ChecklistBlock';
import { ImageBlock } from '@/components/content-blocks/ImageBlock';
import { TextBlock } from '@/components/content-blocks/TextBlock';
import useNote from '@/hooks/useNote';
import { ContentBlock, ContentType } from '@/types';
import { convertAndFormatUTC } from '@/utils/utils';

export default function NoteDetails() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    title,
    content,
    hasChanges,
    handleUpdateTitle,
    handleTitleSubmit,
    handleSave,
    addNewContentBlock,
    handleUpdateBlock,
    handleDeleteBlock,
    handlePickImage,
    createdAt,
  } = useNote(id);
  const [isRecordingModalVisible, setIsRecordingModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState<boolean>(false);
  const [optionsId, setOptionsId] = useState<string | null>(null);

  // Handle hardware back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (hasChanges) handleSave();
      return false; // Allow default behavior
    });

    return () => backHandler.remove();
  }, [title, content, hasChanges]);

  const handleOpenOptionsModal = (id: string) => {
    setOptionsId(id);
    setOptionsModalVisible(true);
  };

  const onToolbarOptionSelected = (type: ContentType) => {
    switch (type) {
      case ContentType.CHECKLIST:
        addNewContentBlock(ContentType.CHECKLIST, { items: [], title: '' });
        break;
      case ContentType.AUDIO:
        setIsRecordingModalVisible(true);
        break;
      case ContentType.IMAGE:
        handlePickImage();
        break;
      default:
        break;
    }
  };

  const renderContentBlock = useCallback(
    ({ item: block, index }: { item: ContentBlock; index: number }) => {
      switch (block.type) {
        case ContentType.TEXT:
          return (
            <TextBlock
              key={block.id}
              block={block}
              onUpdate={handleUpdateBlock}
              onDelete={handleDeleteBlock}
              focus={block.props.focus}
              isLast={index === content.length - 1}
            />
          );
        case ContentType.CHECKLIST:
          return <ChecklistBlock key={block.id} block={block} onUpdate={handleUpdateBlock} />;
        case ContentType.IMAGE:
          return <ImageBlock key={block.id} block={block} onDelete={handleDeleteBlock} />;
        case ContentType.AUDIO:
          return <AudioBlock key={block.id} block={block} openOptions={handleOpenOptionsModal} />;
        default:
          return null;
      }
    },
    [content]
  );

  const handleAddTags = () => {};

  return (
    <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <NoteHeader
        title={title}
        updateTitle={handleUpdateTitle}
        submitTitle={handleTitleSubmit}
        colorScheme={colorScheme}
        onBack={() => {
          handleSave(true);
        }}
        onMain={handleAddTags}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Content */}
        <FlatList
          data={content}
          renderItem={renderContentBlock}
          keyExtractor={(item) => item.id}
          alwaysBounceVertical
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow px-4"
          ListFooterComponent={() => (
            <Text className="p-4 pt-20 text-center">Creado {convertAndFormatUTC(createdAt)}</Text>
          )}
        />
        {/* Toolbar */}
        <NoteToolbar colorScheme={colorScheme} onOptionSelected={onToolbarOptionSelected} />
      </KeyboardAvoidingView>

      {/* Modals */}
      <AudioRecordingModal
        visible={isRecordingModalVisible}
        onClose={() => setIsRecordingModalVisible(false)}
        onSave={(props) => {
          setIsRecordingModalVisible(false);

          addNewContentBlock(ContentType.AUDIO, props);
        }}
      />
      <BlockOptionsModal
        type={ContentType.AUDIO}
        id={optionsId || ''}
        visible={optionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        onDelete={handleDeleteBlock}
      />
    </SafeAreaView>
  );
}
