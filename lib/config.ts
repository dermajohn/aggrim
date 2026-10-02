// Server-to-language mapping configuration
// Maps video source server names to clean language labels

export interface ServerLanguageMapping {
  serverPattern: RegExp;
  language: string;
  languageCode: string;
}

export const SERVER_LANGUAGE_MAP: ServerLanguageMapping[] = [
  // Hindi servers
  { serverPattern: /delhi/i, language: 'Hindi', languageCode: 'hi' },
  { serverPattern: /mumbai/i, language: 'Hindi', languageCode: 'hi' },
  { serverPattern: /hindi/i, language: 'Hindi', languageCode: 'hi' },
  { serverPattern: /india/i, language: 'Hindi', languageCode: 'hi' },

  // English servers
  { serverPattern: /miami/i, language: 'English', languageCode: 'en' },
  { serverPattern: /london/i, language: 'English', languageCode: 'en' },
  { serverPattern: /english/i, language: 'English', languageCode: 'en' },
  { serverPattern: /us\b/i, language: 'English', languageCode: 'en' },
  { serverPattern: /uk\b/i, language: 'English', languageCode: 'en' },

  // Tamil servers
  { serverPattern: /tamil/i, language: 'Tamil', languageCode: 'ta' },
  { serverPattern: /chennai/i, language: 'Tamil', languageCode: 'ta' },

  // Telugu servers
  { serverPattern: /telugu/i, language: 'Telugu', languageCode: 'te' },
  { serverPattern: /hyderabad/i, language: 'Telugu', languageCode: 'te' },

  // Other languages
  { serverPattern: /korean/i, language: 'Korean', languageCode: 'ko' },
  { serverPattern: /seoul/i, language: 'Korean', languageCode: 'ko' },
  { serverPattern: /japanese/i, language: 'Japanese', languageCode: 'ja' },
  { serverPattern: /tokyo/i, language: 'Japanese', languageCode: 'ja' },
  { serverPattern: /spanish/i, language: 'Spanish', languageCode: 'es' },
  { serverPattern: /french/i, language: 'French', languageCode: 'fr' },
  { serverPattern: /german/i, language: 'German', languageCode: 'de' },
  { serverPattern: /portuguese/i, language: 'Portuguese', languageCode: 'pt' },
  { serverPattern: /chinese/i, language: 'Chinese', languageCode: 'zh' },
  { serverPattern: /arabic/i, language: 'Arabic', languageCode: 'ar' },
];

// TMDB language code to display name
export const LANGUAGE_NAMES: Record<string, string> = {
  hi: 'Hindi',
  en: 'English',
  ta: 'Tamil',
  te: 'Telugu',
  ko: 'Korean',
  ja: 'Japanese',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  zh: 'Chinese',
  ar: 'Arabic',
  it: 'Italian',
  ru: 'Russian',
  th: 'Thai',
  ml: 'Malayalam',
  kn: 'Kannada',
  mr: 'Marathi',
  bn: 'Bengali',
  pa: 'Punjabi',
  ur: 'Urdu',
  gu: 'Gujarati',
};

// Video source base URLs
export const VIDEO_SOURCE_BASE = 'https://vidsrc.to';
export const VIDEO_SOURCE_EMBED = 'https://vidsrc.to/embed';
export const VIDEO_SOURCE_API = 'https://vidsrc.to/ajax';
