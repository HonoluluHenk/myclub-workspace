export type SupportedLang = 'de' | 'fr' | 'it';
export const SupportedLang = {
  de: 'de' as SupportedLang,
  fr: 'fr' as SupportedLang,
  it: 'it' as SupportedLang,
}

export interface I18NText {
  de: string;
  fr: string;
  it: string;
}

export function textFor(lang: SupportedLang, text: I18NText): string {
  return text[lang] ?? '';
}
