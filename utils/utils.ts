/* eslint-disable prettier/prettier */

import { ColorSchemeName } from 'react-native';

export const getIconColor = (colorScheme: ColorSchemeName, disabled?: boolean) =>
  disabled ? '#eee' : colorScheme === 'dark' ? 'white' : '#1f2937';
