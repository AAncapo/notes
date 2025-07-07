/* eslint-disable prettier/prettier */
/* eslint-disable no-case-declarations */
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  FlatList,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AudioRecordingModal } from '@/components/AudioRecordingModal';
import BlockOptionsModal from '@/components/BlockOptionsModal';
import { AudioBlock } from '@/components/content-blocks/AudioBlock';
import { ChecklistBlock } from '@/components/content-blocks/ChecklistBlock';
import { ImageBlock } from '@/components/content-blocks/ImageBlock';
import { TextBlock } from '@/components/content-blocks/TextBlock';
import { useNotesStore } from '@/store/useNotesStore';
import { BlockProps, ContentBlock, ContentType } from '@/types';
import { getIconColor } from '@/utils/utils';

const textPlaceholder = 'Start typing...';

export default function NoteDetails() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNewNote = !id || id === 'new';
  const { getNote, addNote, updateNote } = useNotesStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [isRecordingModalVisible, setIsRecordingModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState<boolean>(false);
  const [optionsId, setOptionsId] = useState<string | null>(null);

  useEffect(() => {
    if (!isNewNote) {
      const existingNote = getNote(id);
      if (existingNote) {
        setTitle(existingNote.title);
        setContent(existingNote.content);
      }
    } else {
      if (content.length === 0) {
        console.log('Opened new note -> Adding default initial text block...');
        addNewContentBlock(ContentType.TEXT, {
          text: '',
          placeholder: textPlaceholder,
          isExpanded: true,
          focus: false,
        });
      }
    }
  }, [isNewNote]);

  // Handle hardware back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      //   return true; // Prevent default behavior
      handleSave();
      return false; // Allow default behavior
    });

    return () => backHandler.remove();
  }, [title, content]);

  const handleSave = (goBack?: boolean) => {
    const isBlank = !title.length && content.length === 1 && !content[0].props.text;
    if (isBlank) {
      console.log('Nota vacía descartada');
      goBack && router.back();
      return;
    }

    if (!isNewNote) {
      updateNote(id as string, { title, content });
    } else {
      addNote({ title, content });
    }
    goBack && router.back();
  };

  const addNewContentBlock = (type: ContentType, { ...props }: Partial<BlockProps> | undefined) => {
    let newBlock: ContentBlock | null = null;
    switch (type) {
      case ContentType.TEXT:
        newBlock = {
          id: Date.now().toString(),
          type,
          props: {
            ...props,
          },
        };
        break;
      case ContentType.CHECKLIST:
        newBlock = {
          id: Date.now().toString(),
          type,
          props: {
            items: [{ id: Date.now().toString(), text: '', checked: false }],
          },
        };
        break;
      case ContentType.IMAGE:
        newBlock = {
          id: Date.now().toString(),
          type,
          props: {
            ...props,
          },
        };
        break;
      case ContentType.AUDIO:
        console.log('saving audio...', props.uri);
        newBlock = {
          id: Date.now().toString(),
          type,
          props: {
            title: props.title,
            uri: props.uri,
            duration: props.duration,
            createdAt: new Date().toISOString(),
          },
        };
        setIsRecordingModalVisible(false);
        break;
      default:
        break;
    }

    // Shrink the previous last block if it was expanded (or any other expanded block)
    const updatedContent = content.map((block) =>
      block.props.isExpanded ? { ...block, props: { ...block.props, isExpanded: false } } : block
    );

    // eslint-disable-next-line prefer-const
    let newContent: ContentBlock[] = [...updatedContent];

    // Borra último block (anterior al nuevo) si es texto vacío
    if (updatedContent.length > 0) {
      const lastBlock = updatedContent[updatedContent.length - 1];
      if (lastBlock.type === ContentType.TEXT && !lastBlock.props.text?.length) {
        newContent.pop();
      }
    }

    if (newBlock) {
      newContent.push(newBlock);
      if (type !== ContentType.TEXT) {
        // Añade un text seguido del block si el añadido no es tipo text
        newContent.push({
          id: Date.now().toString() + 'new',
          type: ContentType.TEXT,
          props: {
            isExpanded: true,
            focus: false,
            text: '',
            placeholder: '',
          },
        });
      }
      setContent([...newContent]);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled) {
      addNewContentBlock(ContentType.IMAGE, {
        text: 'Image',
        uri: result.assets[0].uri,
      });
    }
  };

  const handleUpdateBlock = (updatedBlock: ContentBlock) => {
    const newContent = content.map((block) =>
      block.id === updatedBlock.id ? updatedBlock : block
    );
    setContent(newContent);
  };

  const handleDeleteBlock = (blockId: string) => {
    // No borrar si es el último texto
    const deleteIndex = content.findIndex((b) => b.id === blockId);
    if (content[deleteIndex].type === ContentType.TEXT) {
      if (deleteIndex === 0) {
        console.log('No puede eliminar el primer texto onBackspace');
        return;
      }
      if (deleteIndex > 0 && content[deleteIndex - 1].type === ContentType.TEXT) {
        // TODO: Enfocar anterior primero
        console.log('TODO: Enfocar texto anterior antes de borrar seleccionado');
      } else {
        console.log('No puede eliminar el ultimo texto onBackspace');
        return;
      }
    }

    const newContent = content.filter((block) => block.id !== blockId);
    if (!newContent.length) {
      // Si block borrado es el primero y la nota va a quedar vacia add texto default
      // Esto no debería suceder ya que siempre habrá una nota de texto al final
      addNewContentBlock(ContentType.TEXT, {
        text: '',
        placeholder: textPlaceholder,
        isExpanded: true,
        focus: false,
      });
    }

    setContent(newContent);
  };

  const handleTitleSubmit = () => {
    // Create text block if content is empty
    const defaultBlock =
      content.length === 1 && content[0].type === ContentType.TEXT ? content[0] : null;
    if (defaultBlock && defaultBlock.props.text === '') {
      setContent([{ ...defaultBlock, props: { ...defaultBlock.props, focus: true } }]);
    }
  };

  const handleOpenOptionsModal = (id: string) => {
    setOptionsId(id);
    setOptionsModalVisible(true);
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

  return (
    <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <View
        className={`flex-row items-center justify-between border-b p-4 ${
          colorScheme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <TouchableOpacity
          onPress={() => {
            handleSave(true);
          }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colorScheme === 'dark' ? 'white' : 'black'}
          />
        </TouchableOpacity>
        <TextInput
          className={`mx-4 flex-1 text-center text-xl font-bold ${
            colorScheme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}
          value={title}
          onChangeText={setTitle}
          placeholder="Título"
          onSubmitEditing={handleTitleSubmit}
        />
        <TouchableOpacity onPress={() => handleSave(true)}>
          <Ionicons name="checkmark" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <FlatList
          data={content}
          renderItem={renderContentBlock}
          keyExtractor={(item) => item.id}
          alwaysBounceVertical
          contentContainerClassName="flex-grow px-4 pb-20"
          keyboardShouldPersistTaps="handled"
        />

        {/* Toolbar */}
        <View
          className={`flex-row justify-around border-t p-4 ${
            colorScheme === 'dark' ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'
          }`}
        >
          <TouchableOpacity
            disabled
            className="flex-1 items-center"
            onPress={() => addNewContentBlock(ContentType.CHECKLIST, undefined)}
          >
            <Ionicons name="list" size={24} color={getIconColor(colorScheme, true)} />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center"
            onPress={() => setIsRecordingModalVisible(true)}
          >
            <Ionicons name="mic" size={24} color={getIconColor(colorScheme)} />
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center" onPress={handlePickImage}>
            <Ionicons name="image" size={24} color={getIconColor(colorScheme)} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <AudioRecordingModal
        visible={isRecordingModalVisible}
        onClose={() => setIsRecordingModalVisible(false)}
        onSave={(props) => addNewContentBlock(ContentType.AUDIO, props)}
      />
      {/* BlockOptionsModal */}
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
