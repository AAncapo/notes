/* eslint-disable prettier/prettier */
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useState, useEffect } from "react";
import { View, Modal, TouchableOpacity, Text, useColorScheme } from "react-native";

interface AudioRecordingModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (uri: string, duration: number) => void;
}

export function AudioRecordingModal({ visible, onClose, onSave }: AudioRecordingModalProps) {
  const colorScheme = useColorScheme();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      setTimer(interval);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const pauseRecording = async () => {
    if (!recording) return;
    try {
      await recording.pauseAsync();
      setIsPaused(true);
      if (timer) clearInterval(timer);
    } catch (err) {
      console.error("Failed to pause recording", err);
    }
  };

  const resumeRecording = async () => {
    if (!recording) return;
    try {
      await recording.startAsync();
      setIsPaused(false);
      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      setTimer(interval);
    } catch (err) {
      console.error("Failed to resume recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        onSave(uri, duration);
      }
      setRecording(null);
      setIsRecording(false);
      setIsPaused(false);
      setDuration(0);
      if (timer) clearInterval(timer);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View
          className={`w-4/5 rounded-xl p-6 ${colorScheme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          <View className="mb-6 items-center">
            <Text
              className={`text-xl font-bold ${
                colorScheme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              {formatTime(duration)}
            </Text>
          </View>

          <View className="mb-6 flex-row justify-around">
            <TouchableOpacity
              className={`rounded-full p-4 ${
                colorScheme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
              onPress={isRecording ? (isPaused ? resumeRecording : pauseRecording) : startRecording}
            >
              <Ionicons
                name={isRecording ? (isPaused ? "play" : "pause") : "mic"}
                size={32}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </TouchableOpacity>

            {isRecording && (
              <TouchableOpacity className="rounded-full bg-red-500 p-4" onPress={stopRecording}>
                <Ionicons name="stop" size={32} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity className="p-3" onPress={onClose}>
              <Text className={`${colorScheme === "dark" ? "text-white" : "text-gray-800"}`}>
                Cancel
              </Text>
            </TouchableOpacity>

            {isRecording && (
              <TouchableOpacity className="p-3" onPress={stopRecording}>
                <Text className="text-blue-500">Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
