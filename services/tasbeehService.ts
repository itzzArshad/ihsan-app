
export interface TasbeehType {
  id: string;
  label: string;
  arabic: string;
  transliteration: string;
  meaning: string;
}

export const TASBEEH_TYPES: TasbeehType[] = [
  { id: 'subhanallah', label: 'SubhanAllah', arabic: 'سُبْحَانَ ٱللَّٰهِ', transliteration: 'SubhanAllah', meaning: 'Glory be to Allah' },
  { id: 'alhamdulillah', label: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', transliteration: 'Alhamdulillah', meaning: 'All praise is due to Allah' },
  { id: 'allahuakbar', label: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest' },
  { id: 'lailahaillallah', label: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', transliteration: 'La ilaha illallah', meaning: 'There is no god but Allah' },
  { id: 'astaghfirullah', label: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', transliteration: 'Astaghfirullah', meaning: 'I seek forgiveness from Allah' },
  { id: 'salawat', label: 'Salawat', arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', transliteration: 'Allahumma salli \'ala Muhammad', meaning: 'Blessings upon Muhammad' }
];

interface StoredData {
  history: Record<string, number>; // "YYYY-MM-DD": count
  streak: number;
  lastLogDate: string | null;
}

const getStorageKey = (id: string) => `ihsan_tasbeeh_${id}`;

// Get raw data from storage or default
const getData = (id: string): StoredData => {
  try {
    const key = getStorageKey(id);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : { history: {}, streak: 0, lastLogDate: null };
  } catch (e) {
    return { history: {}, streak: 0, lastLogDate: null };
  }
};

// Increment count for today and update streak
export const incrementTasbeehCount = (id: string) => {
  const data = getData(id);
  const today = new Date().toISOString().split('T')[0];
  
  // Increment today's count
  data.history[today] = (data.history[today] || 0) + 1;

  // Streak Logic
  if (data.lastLogDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (data.lastLogDate === yesterdayStr) {
      data.streak += 1;
    } else {
      // Reset streak if gap > 1 day, or start new streak if 0
      data.streak = 1;
    }
    data.lastLogDate = today;
  }

  localStorage.setItem(getStorageKey(id), JSON.stringify(data));
  return getStats(id);
};

// Get calculated stats for UI
export const getStats = (id: string) => {
  const data = getData(id);
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.substring(0, 7); // YYYY-MM

  const dailyCount = data.history[today] || 0;
  
  const monthlyCount = Object.entries(data.history)
    .filter(([date]) => date.startsWith(currentMonth))
    .reduce((sum, [, count]) => sum + count, 0);

  return {
    today: dailyCount,
    streak: data.streak,
    month: monthlyCount
  };
};
