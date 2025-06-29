/* eslint-disable prettier/prettier */
import { Audio } from "expo-av";
import { useState } from "react";

export default function useAudioRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);

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
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw error;
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        setAudioUri(uri);
      }
      setRecording(null);
    } catch (error) {
      console.error("Failed to stop recording:", error);
      throw error;
    }
  };

  return { recording, audioUri, startRecording, stopRecording };
}
