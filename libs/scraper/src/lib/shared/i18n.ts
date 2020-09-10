export type PreferredLanguage = 'German' | 'French' | 'Italian';
export const PreferredLanguage = {
  German: 'German' as PreferredLanguage,
  French: 'French' as PreferredLanguage,
  Italian: 'Italian' as PreferredLanguage,
};

export type LanguageCode = 'de' | 'fr' | 'it';

export interface I18NText {
  German: string;
  French: string;
  Italian: string;
}

export function textFor(lang: PreferredLanguage, text: I18NText): string {
  return text[lang] ?? '';
}

export function languageCode(lang: PreferredLanguage): LanguageCode {
  switch (lang) {
    case 'German':
      return 'de';
    case 'French':
      return 'fr';
    case 'Italian':
      return 'it';
  }
}
