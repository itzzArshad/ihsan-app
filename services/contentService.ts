
import { ContentItem, ContentType, AdhkarItem } from '../types';

// --- 99 NAMES DATA (FULL LIST) ---
const NAMES_DATA = [
  { tr: 'Ar-Rahman', ar: 'الرَّحْمَنُ', en: 'The Most Gracious', desc: 'The One who has plenty of mercy for the believers and the blasphemers in this world and specifically for the believers in the Hereafter.' },
  { tr: 'Ar-Raheem', ar: 'الرَّحِيمُ', en: 'The Most Merciful', desc: 'The One who has plenty of mercy for the believers.' },
  { tr: 'Al-Malik', ar: 'الْمَلِكُ', en: 'The King', desc: 'The One with the complete Dominion, the One Whose Dominion is clear from imperfection.' },
  { tr: 'Al-Quddus', ar: 'الْقُدُّوسُ', en: 'The Most Holy', desc: 'The One who is pure from any imperfection and clear from children and adversaries.' },
  { tr: 'As-Salam', ar: 'السَّلاَمُ', en: 'The Source of Peace', desc: 'The One who is free from every imperfection.' },
  { tr: 'Al-Mu\'min', ar: 'الْمُؤْمِنُ', en: 'The Guardian of Faith', desc: 'The One who witnessed for Himself that no one is God but Him. And He witnessed for His believers that they are truthful in their belief that no one is God but Him.' },
  { tr: 'Al-Muhaymin', ar: 'الْمُهَيْمِنُ', en: 'The Protector', desc: 'The One who witnesses the saying and deeds of His creatures.' },
  { tr: 'Al-Aziz', ar: 'الْعَزِيزُ', en: 'The All Mighty', desc: 'The Defeater who is not defeated.' },
  { tr: 'Al-Jabbar', ar: 'الْجَبَّارُ', en: 'The Compeller', desc: 'The One that nothing happens in His Dominion except that which He willed.' },
  { tr: 'Al-Mutakabbir', ar: 'الْمُتَكَبِّرُ', en: 'The Supreme', desc: 'The One who is clear from the attributes of the creatures and from resembling them.' },
  { tr: 'Al-Khaliq', ar: 'الْخَالِقُ', en: 'The Creator', desc: 'The One who brings everything from non-existence to existence.' },
  { tr: 'Al-Bari', ar: 'الْبَارِئُ', en: 'The Evolver', desc: 'The Maker, The Creator who has the Power to turn the entities.' },
  { tr: 'Al-Musawwir', ar: 'الْمُصَوِّرُ', en: 'The Fashioner', desc: 'The One who forms His creatures in different pictures.' },
  { tr: 'Al-Ghaffar', ar: 'الْغَفَّارُ', en: 'The Ever-Forgiving', desc: 'The One who forgives the sins of His slaves time and time again.' },
  { tr: 'Al-Qahhar', ar: 'الْقَهَّارُ', en: 'The Subduer', desc: 'The Dominant, The One who has the perfect Power and is not unable over anything.' },
  { tr: 'Al-Wahhab', ar: 'الْوَهَّابُ', en: 'The Bestower', desc: 'The One who is Generous in giving plenty without any return.' },
  { tr: 'Ar-Razzaq', ar: 'الرَّزَّاقُ', en: 'The Provider', desc: 'The One who gives the Rizq.' },
  { tr: 'Al-Fattah', ar: 'الْفَتَّاحُ', en: 'The Opener', desc: 'The One who opens for His slaves the closed worldly and religious matters.' },
  { tr: 'Al-Alim', ar: 'الْعَلِيمُ', en: 'The All-Knowing', desc: 'The Knowledgeable; The One nothing is absent from His knowledge.' },
  { tr: 'Al-Qabid', ar: 'الْقَابِضُ', en: 'The Withholder', desc: 'The One who constricts the sustenance.' },
  { tr: 'Al-Basit', ar: 'الْبَاسِطُ', en: 'The Expander', desc: 'The One who expands and widens His munificence.' },
  { tr: 'Al-Khafid', ar: 'الْخَافِضُ', en: 'The Abaser', desc: 'The One who lowers whoever He willed by His Destruction.' },
  { tr: 'Ar-Rafi', ar: 'الرَّافِعُ', en: 'The Exalter', desc: 'The One who raises whoever He willed by His Endowment.' },
  { tr: 'Al-Mu\'izz', ar: 'الْمُعِزُ', en: 'The Bestower of Honors', desc: 'He gives esteem to whoever He willed, hence there is no one to degrade him.' },
  { tr: 'Al-Mudhill', ar: 'الْمُذِلُ', en: 'The Dishonorer', desc: 'He degrades whoever He willed, hence there is no one to give him esteem.' },
  { tr: 'As-Sami', ar: 'السَّمِيعُ', en: 'The All-Hearing', desc: 'The One who Hears all things that are heard by His Eternal Hearing without an ear, instrument or organ.' },
  { tr: 'Al-Basir', ar: 'الْبَصِيرُ', en: 'The All-Seeing', desc: 'The One who Sees all things that are seen by His Eternal Seeing without a pupil or any other instrument.' },
  { tr: 'Al-Hakam', ar: 'الْحَكَمُ', en: 'The Judge', desc: 'He is the Ruler and His judgment is His Word.' },
  { tr: 'Al-Adl', ar: 'الْعَدْلُ', en: 'The Just', desc: 'The One who is entitled to do what He does. He is not unjust.' },
  { tr: 'Al-Latif', ar: 'اللَّطِيفُ', en: 'The Subtle One', desc: 'The One who is kind to His slaves and endows upon them.' },
  { tr: 'Al-Khabir', ar: 'الْخَبِيرُ', en: 'The All-Aware', desc: 'The One who knows the truth of things.' },
  { tr: 'Al-Halim', ar: 'الْحَلِيمُ', en: 'The Forbearing', desc: 'The One who delays the punishment for those who deserve it and then He might forgive them.' },
  { tr: 'Al-Azim', ar: 'الْعَظِيمُ', en: 'The Magnificent', desc: 'The One deserving the attributes of Exaltment, Glory, Extolment, and Purity from all imperfection.' },
  { tr: 'Al-Ghafur', ar: 'الْغَفُورُ', en: 'The Forgiver', desc: 'The One who forgives a lot.' },
  { tr: 'Ash-Shakur', ar: 'الشَّكُورُ', en: 'The Appreciative', desc: 'The One who gives a lot of reward for a little obedience.' },
  { tr: 'Al-Ali', ar: 'الْعَلِيُ', en: 'The Most High', desc: 'The One who is clear from the attributes of the creatures.' },
  { tr: 'Al-Kabir', ar: 'الْكَبِيرُ', en: 'The Most Great', desc: 'The One who is greater than everything in status.' },
  { tr: 'Al-Hafiz', ar: 'الْحَفِيظُ', en: 'The Preserver', desc: 'The One who protects whatever and whoever He willed to protect.' },
  { tr: 'Al-Muqit', ar: 'الْمُقِيتُ', en: 'The Maintainer', desc: 'The One who has the Power.' },
  { tr: 'Al-Hasib', ar: 'الْحَسِيبُ', en: 'The Reckoner', desc: 'The One who gives the satisfaction.' },
  { tr: 'Al-Jalil', ar: 'الْجَلِيلُ', en: 'The Sublime One', desc: 'The One who is attributed with greatness of Power and Glory of status.' },
  { tr: 'Al-Karim', ar: 'الْكَرِيمُ', en: 'The Generous', desc: 'The One who is clear from abjectness.' },
  { tr: 'Ar-Raqib', ar: 'الرَّقِيبُ', en: 'The Watchful', desc: 'The One that nothing is absent from Him. Hence it\'s meaning is related to the attribute of Knowledge.' },
  { tr: 'Al-Mujib', ar: 'الْمُجِيبُ', en: 'The Responsive', desc: 'The One who answers the one in need if he asks Him and rescues the yearner if he calls upon Him.' },
  { tr: 'Al-Wasi', ar: 'الْوَاسِعُ', en: 'The All-Encompassing', desc: 'The Knowledgeable.' },
  { tr: 'Al-Hakim', ar: 'الْحَكِيمُ', en: 'The Wise', desc: 'The One who is correct in His acts.' },
  { tr: 'Al-Wadud', ar: 'الْوَدُودُ', en: 'The Loving', desc: 'The One who loves His believing slaves and His believing slaves love Him.' },
  { tr: 'Al-Majid', ar: 'الْمَجِيدُ', en: 'The Glorious', desc: 'The One who is with perfect Power, High Status, Compassion, Generosity and Kindness.' },
  { tr: 'Al-Ba\'ith', ar: 'الْبَاعِثُ', en: 'The Resurrecter', desc: 'The One who resurrects the creatures after they have been nonexistent and dead.' },
  { tr: 'Ash-Shahid', ar: 'الشَّهِيدُ', en: 'The Witness', desc: 'The One who nothing is absent from Him.' },
  { tr: 'Al-Haqq', ar: 'الْحَقُ', en: 'The Truth', desc: 'The One who truly exists.' },
  { tr: 'Al-Wakil', ar: 'الْوَكِيلُ', en: 'The Trustee', desc: 'The One who gives the satisfaction and is relied upon.' },
  { tr: 'Al-Qawiyy', ar: 'الْقَوِيُ', en: 'The Strong', desc: 'The One with the complete Power.' },
  { tr: 'Al-Matin', ar: 'الْمَتِينُ', en: 'The Firm', desc: 'The One with extreme Power which is un-interrupted and He does not get tired.' },
  { tr: 'Al-Waliyy', ar: 'الْوَلِيُ', en: 'The Protecting Friend', desc: 'The Supporter, the Lover.' },
  { tr: 'Al-Hamid', ar: 'الْحَمِيدُ', en: 'The Praiseworthy', desc: 'The praised One who deserves to be praised.' },
  { tr: 'Al-Muhsi', ar: 'الْمُحْصِي', en: 'The Counter', desc: 'The One who the count of things are known to him.' },
  { tr: 'Al-Mubdi', ar: 'الْمُبْدِئُ', en: 'The Originator', desc: 'The One who started the human being. That is, He created him.' },
  { tr: 'Al-Mu\'id', ar: 'الْمُعِيدُ', en: 'The Restorer', desc: 'The One who brings back the creatures after death.' },
  { tr: 'Al-Muhyi', ar: 'الْمُحْيِي', en: 'The Giver of Life', desc: 'The One who took out a living human from semen that does not have a soul. He gives life by giving the souls back to the worn out bodies on the resurrection day and He makes the hearts alive by the light of knowledge.' },
  { tr: 'Al-Mumit', ar: 'الْمُمِيتُ', en: 'The Destroyer', desc: 'The One who renders the living dead.' },
  { tr: 'Al-Hayy', ar: 'الْحَيُ', en: 'The Ever-Living', desc: 'The One attributed with a life that is unlike our life and is not that of a combination of soul, flesh or blood.' },
  { tr: 'Al-Qayyum', ar: 'الْقَيُّومُ', en: 'The Self-Subsisting', desc: 'The One who remains and does not end.' },
  { tr: 'Al-Wajid', ar: 'الْوَاجِدُ', en: 'The Finder', desc: 'The Rich who is never poor. Al-Wajid is Richness.' },
  { tr: 'Al-Majid', ar: 'الْمَاجِدُ', en: 'The Noble', desc: 'The One who is Majid.' },
  { tr: 'Al-Wahid', ar: 'الْوَاحِدُ', en: 'The Unique', desc: 'The One without a partner.' },
  { tr: 'Al-Ahad', ar: 'الأَحَد', en: 'The One', desc: 'The only One.' },
  { tr: 'As-Samad', ar: 'الصَّمَدُ', en: 'The Eternal', desc: 'The Master who is relied upon in matters and reverted to in ones needs.' },
  { tr: 'Al-Qadir', ar: 'الْقَادِرُ', en: 'The Able', desc: 'The One attributed with Power.' },
  { tr: 'Al-Muqtadir', ar: 'الْمُقْتَدِرُ', en: 'The Powerful', desc: 'The One with the perfect Power that nothing is withheld from Him.' },
  { tr: 'Al-Muqaddim', ar: 'الْمُقَدِّمُ', en: 'The Expediter', desc: 'The One who puts things in their right places. He makes ahead what He wills and delays what He wills.' },
  { tr: 'Al-Mu\'akhkhir', ar: 'الْمُؤَخِّرُ', en: 'The Delayer', desc: 'The One who puts things in their right places. He makes ahead what He wills and delays what He wills.' },
  { tr: 'Al-Awwal', ar: 'الأَوَّلُ', en: 'The First', desc: 'The One whose Existence is without a beginning.' },
  { tr: 'Al-Akhir', ar: 'الآخِرُ', en: 'The Last', desc: 'The One whose Existence is without an end.' },
  { tr: 'Az-Zahir', ar: 'الظَّاهِرُ', en: 'The Manifest', desc: 'The One that nothing is above Him and nothing is underneath Him, hence He exists without a place.' },
  { tr: 'Al-Batin', ar: 'الْبَاطِنُ', en: 'The Hidden', desc: 'The One that nothing is above Him and nothing is underneath Him, hence He exists without a place.' },
  { tr: 'Al-Wali', ar: 'الْوَالِي', en: 'The Governor', desc: 'The One who owns things and manages them.' },
  { tr: 'Al-Muta\'ali', ar: 'الْمُتَعَالِي', en: 'The Most Exalted', desc: 'The One who is clear from the attributes of the creation.' },
  { tr: 'Al-Barr', ar: 'الْبَرُّ', en: 'The Source of Goodness', desc: 'The One who is kind to His creatures, who covered them with His sustenance and specified whoever He willed among them by His support, protection, and special mercy.' },
  { tr: 'At-Tawwab', ar: 'التَّوَّابُ', en: 'The Acceptor of Repentance', desc: 'The One who grants repentance to whoever He willed among His creatures and accepts his repentance.' },
  { tr: 'Al-Muntaqim', ar: 'الْمُنْتَقِمُ', en: 'The Avenger', desc: 'The One who victoriously prevails over His enemies and punishes them for their sins.' },
  { tr: 'Al-Afuww', ar: 'الْعَفُوُّ', en: 'The Pardoner', desc: 'The One with wide forgiveness.' },
  { tr: 'Ar-Ra\'uf', ar: 'الرَّءُوفُ', en: 'The Compassionate', desc: 'The One with extreme Mercy. The Mercy of Allah is His will to endow upon whoever He willed among His creatures.' },
  { tr: 'Malik-ul-Mulk', ar: 'مَالِكُ الْمُلْكِ', en: 'The Eternal Owner of Sovereignty', desc: 'The One who controls the Dominion and gives dominion to whoever He willed.' },
  { tr: 'Dhul-Jalali-wal-Ikram', ar: 'ذُو الْجَلاَلِ وَالإِكْرَامِ', en: 'The Lord of Majesty and Bounty', desc: 'The One who deserves to be Exalted and not denied.' },
  { tr: 'Al-Muqsit', ar: 'الْمُقْسِطُ', en: 'The Equitable', desc: 'The One who is Just in His judgment.' },
  { tr: 'Al-Jami', ar: 'الْجَامِعُ', en: 'The Gatherer', desc: 'The One who gathers the creatures on a day that there is no doubt about, that is the Day of Judgment.' },
  { tr: 'Al-Ghaniyy', ar: 'الْغَنِيُّ', en: 'The Self-Sufficient', desc: 'The One who does not need the creation.' },
  { tr: 'Al-Mughni', ar: 'الْمُغْنِي', en: 'The Enricher', desc: 'The One who satisfies the necessities of the creatures.' },
  { tr: 'Al-Mani', ar: 'الْمَانِعُ', en: 'The Preventer', desc: 'The Supporter who protects and gives victory to His pious believers.' },
  { tr: 'Ad-Darr', ar: 'الضَّارُ', en: 'The Distresser', desc: 'The One who makes harm reach to whoever He willed and benefit to whoever He willed.' },
  { tr: 'An-Nafi', ar: 'النَّافِعُ', en: 'The Propitious', desc: 'The One who makes harm reach to whoever He willed and benefit to whoever He willed.' },
  { tr: 'An-Nur', ar: 'النُّورُ', en: 'The Light', desc: 'The One who guides.' },
  { tr: 'Al-Hadi', ar: 'الْهَادِي', en: 'The Guide', desc: 'The One whom with His Guidance His believers were guided, and with His Guidance the living beings have been guided to what is beneficial for them and protected from what is harmful to them.' },
  { tr: 'Al-Badi', ar: 'الْبَدِيعُ', en: 'The Incomparable', desc: 'The One who created the creation and formed it without any preceding example.' },
  { tr: 'Al-Baqi', ar: 'الْبَاقِي', en: 'The Everlasting', desc: 'The One that the state of non-existence is impossible for Him.' },
  { tr: 'Al-Warith', ar: 'الْوَارِثُ', en: 'The Supreme Inheritor', desc: 'The One whose Existence remains.' },
  { tr: 'Ar-Rashid', ar: 'الرَّشِيدُ', en: 'The Guide to the Right Path', desc: 'The One who guides.' },
  { tr: 'As-Sabur', ar: 'الصَّبُورُ', en: 'The Patient', desc: 'The One who does not quickly punish the sinners.' }
];

// Generate ContentItems from Names Data
const namesContentItems: ContentItem[] = NAMES_DATA.map((name, index) => ({
  id: `name-${index + 1}`,
  type: ContentType.NAMES_OF_ALLAH,
  arabicText: name.ar,
  englishTranslation: name.tr, // Using Transliteration as main english Text
  urduTranslation: name.en, // Using English Meaning as secondary
  reference: `Name #${index + 1}`,
  description: name.desc
}));


// --- DUAS & GENERAL MOCK CONTENT ---
export const MOCK_CONTENT: ContentItem[] = [
  {
    id: 'd1',
    type: ContentType.DUA,
    arabicText: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    englishTranslation: 'My Lord, expand for me my breast [with assurance] and ease for me my task.',
    urduTranslation: 'اے میرے رب! میرا سینہ کھول دے اور میرا کام آسان کر دے۔',
    reference: 'Surah Taha 20:25-26',
    tags: ['Anxious', 'Exam', 'Stress', 'Public Speaking'],
  },
  {
    id: 'd2',
    type: ContentType.DUA,
    arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    englishTranslation: 'Our Lord! Give us in this world that which is good and in the Hereafter that which is good, and save us from the torment of the Fire.',
    urduTranslation: 'اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی عطا فرما اور ہمیں آگ کے عذاب سے بچا۔',
    reference: 'Surah Al-Baqarah 2:201',
    tags: ['General', 'Happy', 'Grateful'],
  },
];

// Helper to filter content by type (Local only)
export const getContentByType = (type: ContentType): ContentItem[] => {
  if (type === ContentType.NAMES_OF_ALLAH) return namesContentItems;
  return MOCK_CONTENT.filter(item => item.type === type);
};

// Helper to filter Duas by feeling tag
export const getDuasByTag = (tag: string): ContentItem[] => {
  return MOCK_CONTENT.filter(item => 
    item.type === ContentType.DUA && item.tags?.includes(tag)
  );
};

// Fetch a random verse from Quran API
export const fetchRandomQuranVerse = async (): Promise<ContentItem | null> => {
  try {
    const randomVerse = Math.floor(Math.random() * 6236) + 1;
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${randomVerse}/editions/quran-uthmani,en.sahih,ur.jalandhry`
    );
    const data = await response.json();

    if (data.code === 200 && data.data && data.data.length === 3) {
      const arabicData = data.data[0];
      const englishData = data.data[1];
      const urduData = data.data[2];

      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${randomVerse}.mp3`;

      return {
        id: `q-${randomVerse}-${Date.now()}`,
        type: ContentType.QURAN,
        arabicText: arabicData.text,
        englishTranslation: englishData.text,
        urduTranslation: urduData.text,
        reference: `Surah ${arabicData.surah.englishName} ${arabicData.surah.number}:${arabicData.numberInSurah}`,
        audioUrl: audioUrl
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch Quran verse", error);
    return null;
  }
};

// Fetch a random Hadith from Fawaz Ahmed API (Bukhari)
export const fetchRandomHadith = async (): Promise<ContentItem | null> => {
  const maxBukhari = 7000; 
  let attempts = 0;
  
  while (attempts < 3) {
    try {
      const randomId = Math.floor(Math.random() * maxBukhari) + 1;
      
      const [resEn, resAr] = await Promise.all([
        fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari/${randomId}.json`),
        fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari/${randomId}.json`),
      ]);

      if (!resEn.ok || !resAr.ok) {
        attempts++;
        continue;
      }

      const dataEn = await resEn.json();
      const dataAr = await resAr.json();
      
      const enText = dataEn.hadiths?.[0]?.text || "";
      const arText = dataAr.hadiths?.[0]?.text || "";
      
      if (!enText || !arText) {
         attempts++;
         continue;
      }

      return {
        id: `h-${randomId}-${Date.now()}`,
        type: ContentType.HADITH,
        arabicText: arText,
        englishTranslation: enText,
        urduTranslation: 'Translation available in app',
        reference: `Sahih Al-Bukhari ${randomId}`
      };

    } catch (e) {
      console.error("Error fetching hadith attempt " + attempts, e);
      attempts++;
    }
  }
  return null;
};

// --- ADHKAR (Fetched from JSON) ---
export const fetchAdhkarFromApi = async (time: 'Morning' | 'Evening'): Promise<AdhkarItem[]> => {
    try {
        const response = await fetch('/en.json');
        if (!response.ok) {
           console.error("Failed to fetch en.json");
           return [];
        }
        const data = await response.json();
        
        // 0 = Both, 1 = Morning, 2 = Evening
        const targetType = time === 'Morning' ? 1 : 2;
        
        return data.filter((item: any) => item.type === 0 || item.type === targetType).map((item: any) => ({
            id: `adhkar-${item.order}`,
            type: ContentType.ADHKAR,
            time: time,
            targetCount: item.count || 1,
            arabicText: item.content,
            englishTranslation: item.translation,
            urduTranslation: "", // Not available in this dataset
            transliteration: item.transliteration,
            reference: item.source,
            benefit: item.fadl,
            audioUrl: item.audio
        }));
    } catch (error) {
        console.error("Error parsing Adhkar data", error);
        return [];
    }
};
