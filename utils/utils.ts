/* eslint-disable prettier/prettier */

import { ColorSchemeName } from 'react-native';

export const getIconColor = (colorScheme: ColorSchemeName, disabled?: boolean) =>
  disabled ? '#eee' : colorScheme === 'dark' ? 'white' : '#1f2937';

export function convertAndFormatUTC(utcDateTime: string, options = {}) {
  try {
    const date = new Date(utcDateTime);
    if (isNaN(date.getTime())) return null;

    // Default formatting options
    const defaultOptions = {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // Merge user options with defaults
    const formatOptions = { ...defaultOptions, ...options } as Intl.DateTimeFormatOptions;

    return new Intl.DateTimeFormat(navigator.language, formatOptions).format(date);
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Example usages:
// console.log(convertAndFormatUTC('2025-07-07T00:00:00.000Z'));
// Output depends on user's locale, e.g.: "Jul 6, 2025, 5:00:00 PM" (for PDT)

// console.log(
//   convertAndFormatUTC('2025-07-07T00:00:00.000Z', {
//     dateStyle: 'full',
//     timeStyle: 'short',
//   })
// );
// Example output: "Sunday, July 6, 2025 at 5:00 PM"
