/* eslint-disable prettier/prettier */
import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { ShareIntentProvider, useShareIntent } from 'expo-share-intent';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function Layout() {
  const colorScheme = useColorScheme();
  const { hasShareIntent, shareIntent, resetShareIntent, error } = useShareIntent();

  return (
    <ShareIntentProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar
          style={colorScheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
        />
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            },
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </ThemeProvider>
    </ShareIntentProvider>
  );
}
