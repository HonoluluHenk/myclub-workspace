import {DateTime} from 'luxon';
import {hasValue} from '../shared/Empty.type';

export function clean(text: string | null | undefined): string {
  const cleaned = trimToEmpty(text);
  return cleaned;
}

export function parseDateFormat(cleanTimeText: string, format: string) {
  return DateTime.fromFormat(cleanTimeText, format, {locale: 'de', zone: 'Europe/Zurich', setZone: true});
}

export function parseDate(dateText: string, fallback: DateTime | null | undefined): DateTime | typeof fallback {
  const cleanText = clean(dateText);

  if (!cleanText) {
    return fallback;
  }

  const date: DateTime | null = parseDateFormat(cleanText, 'dd.MM.yyyy');
  if (date?.isValid) {
    return date;
  }

  throw new Error(`Invalid date: ${date}(${dateText}/${fallback})`);
}

function trimToEmpty(text: string | null | undefined): string {
  if (hasValue(text)) {
    const result = text.trim();
    return result;
  }
  return '';
}
