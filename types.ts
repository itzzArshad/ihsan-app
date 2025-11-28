
export enum ContentType {
  QURAN = 'Quran',
  HADITH = 'Hadith',
  DUA = 'Dua',
  NAMES_OF_ALLAH = '99 Names',
  ADHKAR = 'Adhkar',
  TASBEEH = 'Tasbeeh',
}

export interface ContentItem {
  id: string;
  type: ContentType;
  arabicText: string;
  englishTranslation: string;
  urduTranslation: string;
  reference: string;
  audioUrl?: string;     // URL for Quran audio
  tags?: string[];       // Tags for feelings (e.g., 'Anxious', 'Happy')
  description?: string;  // Extra context, benefits (for Names of Allah)
}

export interface AdhkarItem extends ContentItem {
  targetCount: number;
  time: 'Morning' | 'Evening' | 'Both';
  benefit?: string;
  transliteration?: string;
}

export interface ApiResponse {
  code: number;
  status: string;
  data: any;
}