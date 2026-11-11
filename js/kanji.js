/**
 * Travel kanji: words you actually see on signs, at stations, in shops and on menus in Japan.
 * `kana` is what gets spoken (TTS reads kana more reliably than kanji).
 */

export const KANJI_GROUPS = [
  { id: 'all', label: 'All' },
  { id: 'signs', label: 'Signs' },
  { id: 'station', label: 'Station' },
  { id: 'shop', label: 'Shop & food' },
  { id: 'numbers', label: 'Numbers' }
];

export const KANJI_DATA = [
  // Signs & directions
  { kanji: '入口', kana: 'いりぐち', romaji: 'iriguchi', meaning: 'Entrance', group: 'signs' },
  { kanji: '出口', kana: 'でぐち', romaji: 'deguchi', meaning: 'Exit', group: 'signs' },
  { kanji: '非常口', kana: 'ひじょうぐち', romaji: 'hijōguchi', meaning: 'Emergency exit', group: 'signs' },
  { kanji: '押', kana: 'おす', romaji: 'osu', meaning: 'Push (door)', group: 'signs' },
  { kanji: '引', kana: 'ひく', romaji: 'hiku', meaning: 'Pull (door)', group: 'signs' },
  { kanji: '男', kana: 'おとこ', romaji: 'otoko', meaning: 'Men', group: 'signs' },
  { kanji: '女', kana: 'おんな', romaji: 'onna', meaning: 'Women', group: 'signs' },
  { kanji: 'お手洗い', kana: 'おてあらい', romaji: 'otearai', meaning: 'Restroom', group: 'signs' },
  { kanji: '禁煙', kana: 'きんえん', romaji: 'kin\'en', meaning: 'No smoking', group: 'signs' },
  { kanji: '東', kana: 'ひがし', romaji: 'higashi', meaning: 'East', group: 'signs' },
  { kanji: '西', kana: 'にし', romaji: 'nishi', meaning: 'West', group: 'signs' },
  { kanji: '南', kana: 'みなみ', romaji: 'minami', meaning: 'South', group: 'signs' },
  { kanji: '北', kana: 'きた', romaji: 'kita', meaning: 'North', group: 'signs' },
  { kanji: '上', kana: 'うえ', romaji: 'ue', meaning: 'Up / above', group: 'signs' },
  { kanji: '下', kana: 'した', romaji: 'shita', meaning: 'Down / below', group: 'signs' },
  { kanji: '左', kana: 'ひだり', romaji: 'hidari', meaning: 'Left', group: 'signs' },
  { kanji: '右', kana: 'みぎ', romaji: 'migi', meaning: 'Right', group: 'signs' },

  // Station & transport
  { kanji: '駅', kana: 'えき', romaji: 'eki', meaning: 'Station', group: 'station' },
  { kanji: '線', kana: 'せん', romaji: 'sen', meaning: 'Line (train)', group: 'station' },
  { kanji: '番線', kana: 'ばんせん', romaji: 'bansen', meaning: 'Platform no.', group: 'station' },
  { kanji: '乗り場', kana: 'のりば', romaji: 'noriba', meaning: 'Boarding area', group: 'station' },
  { kanji: '切符', kana: 'きっぷ', romaji: 'kippu', meaning: 'Ticket', group: 'station' },
  { kanji: '改札', kana: 'かいさつ', romaji: 'kaisatsu', meaning: 'Ticket gate', group: 'station' },
  { kanji: '空港', kana: 'くうこう', romaji: 'kūkō', meaning: 'Airport', group: 'station' },

  // Shop & food
  { kanji: '円', kana: 'えん', romaji: 'en', meaning: 'Yen', group: 'shop' },
  { kanji: '営業中', kana: 'えいぎょうちゅう', romaji: 'eigyōchū', meaning: 'Open now', group: 'shop' },
  { kanji: '準備中', kana: 'じゅんびちゅう', romaji: 'junbichū', meaning: 'Not open yet', group: 'shop' },
  { kanji: '休み', kana: 'やすみ', romaji: 'yasumi', meaning: 'Closed / day off', group: 'shop' },
  { kanji: '肉', kana: 'にく', romaji: 'niku', meaning: 'Meat', group: 'shop' },
  { kanji: '魚', kana: 'さかな', romaji: 'sakana', meaning: 'Fish', group: 'shop' },
  { kanji: '鶏肉', kana: 'とりにく', romaji: 'toriniku', meaning: 'Chicken', group: 'shop' },
  { kanji: '牛肉', kana: 'ぎゅうにく', romaji: 'gyūniku', meaning: 'Beef', group: 'shop' },
  { kanji: '豚肉', kana: 'ぶたにく', romaji: 'butaniku', meaning: 'Pork', group: 'shop' },
  { kanji: '水', kana: 'みず', romaji: 'mizu', meaning: 'Water', group: 'shop' },
  { kanji: 'お茶', kana: 'おちゃ', romaji: 'ocha', meaning: 'Tea', group: 'shop' },
  { kanji: 'ご飯', kana: 'ごはん', romaji: 'gohan', meaning: 'Rice / meal', group: 'shop' },

  // Numbers (prices, platforms, times)
  { kanji: '一', kana: 'いち', romaji: 'ichi', meaning: '1', group: 'numbers' },
  { kanji: '二', kana: 'に', romaji: 'ni', meaning: '2', group: 'numbers' },
  { kanji: '三', kana: 'さん', romaji: 'san', meaning: '3', group: 'numbers' },
  { kanji: '四', kana: 'よん', romaji: 'yon / shi', meaning: '4', group: 'numbers' },
  { kanji: '五', kana: 'ご', romaji: 'go', meaning: '5', group: 'numbers' },
  { kanji: '六', kana: 'ろく', romaji: 'roku', meaning: '6', group: 'numbers' },
  { kanji: '七', kana: 'なな', romaji: 'nana / shichi', meaning: '7', group: 'numbers' },
  { kanji: '八', kana: 'はち', romaji: 'hachi', meaning: '8', group: 'numbers' },
  { kanji: '九', kana: 'きゅう', romaji: 'kyū', meaning: '9', group: 'numbers' },
  { kanji: '十', kana: 'じゅう', romaji: 'jū', meaning: '10', group: 'numbers' },
  { kanji: '百', kana: 'ひゃく', romaji: 'hyaku', meaning: '100', group: 'numbers' },
  { kanji: '千', kana: 'せん', romaji: 'sen', meaning: '1,000', group: 'numbers' },
  { kanji: '万', kana: 'まん', romaji: 'man', meaning: '10,000', group: 'numbers' }
];

export function getFilteredKanji(group = 'all') {
  return group === 'all' ? KANJI_DATA : KANJI_DATA.filter(k => k.group === group);
}
