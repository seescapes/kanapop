/**
 * Kana Dataset: Comprehensive Hiragana & Katakana with Romaji and row groupings.
 */

export const KANA_ROWS = [
  { id: 'all', label: 'ทั้งหมด (All)' },
  { id: 'a', label: 'あ (A-row: a, i, u, e, o)' },
  { id: 'ka', label: 'か (Ka-row: ka, ki, ku, ke, ko)' },
  { id: 'sa', label: 'さ (Sa-row: sa, shi, su, se, so)' },
  { id: 'ta', label: 'た (Ta-row: ta, chi, tsu, te, to)' },
  { id: 'na', label: 'な (Na-row: na, ni, nu, ne, no)' },
  { id: 'ha', label: 'は (Ha-row: ha, hi, fu, he, ho)' },
  { id: 'ma', label: 'ま (Ma-row: ma, mi, mu, me, mo)' },
  { id: 'ya', label: 'や (Ya-row: ya, yu, yo)' },
  { id: 'ra', label: 'ら (Ra-row: ra, ri, ru, re, ro)' },
  { id: 'wa', label: 'わ (Wa-row: wa, wo, n)' },
  { id: 'dakuten', label: 'が行/ざ行... (Dakuten: ga, za, da, ba, pa)' }
];

export const KANA_DATA = [
  // A row
  { hiragana: 'あ', katakana: 'ア', romaji: 'a', row: 'a' },
  { hiragana: 'い', katakana: 'イ', romaji: 'i', row: 'a' },
  { hiragana: 'う', katakana: 'ウ', romaji: 'u', row: 'a' },
  { hiragana: 'え', katakana: 'エ', romaji: 'e', row: 'a' },
  { hiragana: 'お', katakana: 'オ', romaji: 'o', row: 'a' },

  // Ka row
  { hiragana: 'か', katakana: 'カ', romaji: 'ka', row: 'ka' },
  { hiragana: 'き', katakana: 'キ', romaji: 'ki', row: 'ka' },
  { hiragana: 'く', katakana: 'ク', romaji: 'ku', row: 'ka' },
  { hiragana: 'け', katakana: 'ケ', romaji: 'ke', row: 'ka' },
  { hiragana: 'こ', katakana: 'コ', romaji: 'ko', row: 'ka' },

  // Sa row
  { hiragana: 'さ', katakana: 'サ', romaji: 'sa', row: 'sa' },
  { hiragana: 'し', katakana: 'シ', romaji: 'shi', row: 'sa' },
  { hiragana: 'す', katakana: 'ス', romaji: 'su', row: 'sa' },
  { hiragana: 'せ', katakana: 'セ', romaji: 'se', row: 'sa' },
  { hiragana: 'そ', katakana: 'ソ', romaji: 'so', row: 'sa' },

  // Ta row
  { hiragana: 'た', katakana: 'タ', romaji: 'ta', row: 'ta' },
  { hiragana: 'ち', katakana: 'チ', romaji: 'chi', row: 'ta' },
  { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu', row: 'ta' },
  { hiragana: 'て', katakana: 'テ', romaji: 'te', row: 'ta' },
  { hiragana: 'と', katakana: 'ト', romaji: 'to', row: 'ta' },

  // Na row
  { hiragana: 'な', katakana: 'ナ', romaji: 'na', row: 'na' },
  { hiragana: 'に', katakana: 'ニ', romaji: 'ni', row: 'na' },
  { hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu', row: 'na' },
  { hiragana: 'ね', katakana: 'ネ', romaji: 'ne', row: 'na' },
  { hiragana: 'の', katakana: 'ノ', romaji: 'no', row: 'na' },

  // Ha row
  { hiragana: 'は', katakana: 'ハ', romaji: 'ha', row: 'ha' },
  { hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi', row: 'ha' },
  { hiragana: 'ふ', katakana: 'フ', romaji: 'fu', row: 'ha' },
  { hiragana: 'へ', katakana: 'ヘ', romaji: 'he', row: 'ha' },
  { hiragana: 'ほ', katakana: 'ホ', romaji: 'ho', row: 'ha' },

  // Ma row
  { hiragana: 'ま', katakana: 'マ', romaji: 'ma', row: 'ma' },
  { hiragana: 'み', katakana: 'ミ', romaji: 'mi', row: 'ma' },
  { hiragana: 'む', katakana: 'ム', romaji: 'mu', row: 'ma' },
  { hiragana: 'め', katakana: 'メ', romaji: 'me', row: 'ma' },
  { hiragana: 'も', katakana: 'モ', romaji: 'mo', row: 'ma' },

  // Ya row
  { hiragana: 'や', katakana: 'ヤ', romaji: 'ya', row: 'ya' },
  { hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu', row: 'ya' },
  { hiragana: 'よ', katakana: 'ヨ', romaji: 'yo', row: 'ya' },

  // Ra row
  { hiragana: 'ら', katakana: 'ラ', romaji: 'ra', row: 'ra' },
  { hiragana: 'り', katakana: 'リ', romaji: 'ri', row: 'ra' },
  { hiragana: 'る', katakana: 'ル', romaji: 'ru', row: 'ra' },
  { hiragana: 'れ', katakana: 'レ', romaji: 're', row: 'ra' },
  { hiragana: 'ろ', katakana: 'ロ', romaji: 'ro', row: 'ra' },

  // Wa & N row
  { hiragana: 'わ', katakana: 'ワ', romaji: 'wa', row: 'wa' },
  { hiragana: 'を', katakana: 'ヲ', romaji: 'wo', row: 'wa' },
  { hiragana: 'ん', katakana: 'ン', romaji: 'n', row: 'wa' },

  // Dakuten (voiced sounds)
  { hiragana: 'が', katakana: 'ガ', romaji: 'ga', row: 'dakuten' },
  { hiragana: 'ぎ', katakana: 'ギ', romaji: 'gi', row: 'dakuten' },
  { hiragana: 'ぐ', katakana: 'グ', romaji: 'gu', row: 'dakuten' },
  { hiragana: 'げ', katakana: 'ゲ', romaji: 'ge', row: 'dakuten' },
  { hiragana: 'ご', katakana: 'ゴ', romaji: 'go', row: 'dakuten' },

  { hiragana: 'ざ', katakana: 'ザ', romaji: 'za', row: 'dakuten' },
  { hiragana: 'じ', katakana: 'ジ', romaji: 'ji', row: 'dakuten' },
  { hiragana: 'ず', katakana: 'ズ', romaji: 'zu', row: 'dakuten' },
  { hiragana: 'ぜ', katakana: 'ゼ', romaji: 'ze', row: 'dakuten' },
  { hiragana: 'ぞ', katakana: 'ゾ', romaji: 'zo', row: 'dakuten' },

  { hiragana: 'だ', katakana: 'ダ', romaji: 'da', row: 'dakuten' },
  { hiragana: 'ぢ', katakana: 'ヂ', romaji: 'ji (di)', row: 'dakuten' },
  { hiragana: 'づ', katakana: 'ヅ', romaji: 'zu (du)', row: 'dakuten' },
  { hiragana: 'で', katakana: 'デ', romaji: 'de', row: 'dakuten' },
  { hiragana: 'ど', katakana: 'ド', romaji: 'do', row: 'dakuten' },

  { hiragana: 'ば', katakana: 'バ', romaji: 'ba', row: 'dakuten' },
  { hiragana: 'び', katakana: 'ビ', romaji: 'bi', row: 'dakuten' },
  { hiragana: 'ぶ', katakana: 'ブ', romaji: 'bu', row: 'dakuten' },
  { hiragana: 'べ', katakana: 'ベ', romaji: 'be', row: 'dakuten' },
  { hiragana: 'ぼ', katakana: 'ボ', romaji: 'bo', row: 'dakuten' },

  // Handakuten (p-sounds)
  { hiragana: 'ぱ', katakana: 'パ', romaji: 'pa', row: 'dakuten' },
  { hiragana: 'ぴ', katakana: 'ピ', romaji: 'pi', row: 'dakuten' },
  { hiragana: 'ぷ', katakana: 'プ', romaji: 'pu', row: 'dakuten' },
  { hiragana: 'ぺ', katakana: 'ペ', romaji: 'pe', row: 'dakuten' },
  { hiragana: 'ぽ', katakana: 'ポ', romaji: 'po', row: 'dakuten' }
];

/**
 * Filter items by selected row(s) and character type ('hiragana' | 'katakana')
 */
export function getFilteredKana(selectedRow = 'all') {
  if (selectedRow === 'all') {
    // By default, 'all' returns standard 46 gojūon (everything except dakuten, unless selected)
    return KANA_DATA.filter(item => item.row !== 'dakuten');
  }
  return KANA_DATA.filter(item => item.row === selectedRow);
}
