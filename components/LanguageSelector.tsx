'use client';

import { VideoServer } from '@/lib/videoSource';

interface LanguageSelectorProps {
  servers: VideoServer[];
  originalLanguage: string;
  originalLanguageName: string;
  selectedLanguage: 'original' | 'hindi';
  onLanguageChange: (lang: 'original' | 'hindi') => void;
}

export default function LanguageSelector({
  servers,
  originalLanguage,
  originalLanguageName,
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  // Determine if we should show Hindi option
  const hasHindiServer = servers.some(s => s.languageCode === 'hi');
  const isHindiOriginal = originalLanguage === 'hi';

  // If original is Hindi, only show Hindi button
  if (isHindiOriginal) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Select Language</h3>
        <div className="flex gap-3">
          <button
            className="px-6 py-2 bg-[#e50914] text-white rounded-lg font-medium"
            disabled
          >
            Hindi
          </button>
        </div>
      </div>
    );
  }

  // Non-Hindi original - show Original and optionally Hindi
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">Select Language</h3>
      <div className="flex gap-3">
        <button
          onClick={() => onLanguageChange('original')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedLanguage === 'original'
              ? 'bg-[#e50914] text-white'
              : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
          }`}
        >
          {originalLanguageName}
        </button>
        {hasHindiServer && (
          <button
            onClick={() => onLanguageChange('hindi')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedLanguage === 'hindi'
                ? 'bg-[#e50914] text-white'
                : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
            }`}
          >
            Hindi
          </button>
        )}
      </div>
    </div>
  );
}
