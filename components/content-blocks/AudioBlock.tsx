/* eslint-disable prettier/prettier */
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, useColorScheme } from 'react-native';

import { ContentBlock } from '@/types';

interface AudioBlockProps {
  block: ContentBlock;
  onDelete: (id: string) => void;
}

export function AudioBlock({ block, onDelete }: AudioBlockProps) {
  const colorScheme = useColorScheme();
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    if (!block.props.uri) return;

    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: block.props.uri },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View className="flex-row items-center justify-between py-2">
      <TouchableOpacity
        className="flex-1 flex-row items-center rounded-full bg-gray-200 px-4 py-2 dark:bg-gray-700"
        onPress={playSound}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={24}
          color={colorScheme === 'dark' ? 'white' : 'black'}
        />
        <View className="ml-2 flex-1">
          <View className="h-1 rounded-full bg-gray-300 dark:bg-gray-600">
            <View
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${(position / (block.props.duration || 1)) * 100}%` }}
            />
          </View>
          <View className="mt-1 flex-row justify-between">
            <Text className="text-xs text-gray-500 dark:text-gray-400">{formatTime(position)}</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(block.props.duration || 0)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity className="ml-2 p-2" onPress={() => onDelete(block.id)}>
        <Ionicons name="close" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>
    </View>
  );
}
