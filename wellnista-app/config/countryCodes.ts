export interface CountryCode {
  code: string;
  dialCode: string;
  name: {
    en: string;
    th: string;
    zh: string;
    ja: string;
    ko: string;
    id: string;
  };
  flag: string;
}

export const countryCodes: CountryCode[] = [
  {
    code: 'TH',
    dialCode: '+66',
    name: {
      en: 'Thailand',
      th: 'ประเทศไทย',
      zh: '泰国',
      ja: 'タイ',
      ko: '태국',
      id: 'Thailand'
    },
    flag: '🇹🇭'
  },
  {
    code: 'US',
    dialCode: '+1',
    name: {
      en: 'United States',
      th: 'สหรัฐอเมริกา',
      zh: '美国',
      ja: 'アメリカ',
      ko: '미국',
      id: 'Amerika Serikat'
    },
    flag: '🇺🇸'
  },
  {
    code: 'CN',
    dialCode: '+86',
    name: {
      en: 'China',
      th: 'จีน',
      zh: '中国',
      ja: '中国',
      ko: '중국',
      id: 'Tiongkok'
    },
    flag: '🇨🇳'
  },
  {
    code: 'JP',
    dialCode: '+81',
    name: {
      en: 'Japan',
      th: 'ญี่ปุ่น',
      zh: '日本',
      ja: '日本',
      ko: '일본',
      id: 'Jepang'
    },
    flag: '🇯🇵'
  },
  {
    code: 'KR',
    dialCode: '+82',
    name: {
      en: 'South Korea',
      th: 'เกาหลีใต้',
      zh: '韩国',
      ja: '韓国',
      ko: '대한민국',
      id: 'Korea Selatan'
    },
    flag: '🇰🇷'
  },
  {
    code: 'ID',
    dialCode: '+62',
    name: {
      en: 'Indonesia',
      th: 'อินโดนีเซีย',
      zh: '印度尼西亚',
      ja: 'インドネシア',
      ko: '인도네시아',
      id: 'Indonesia'
    },
    flag: '🇮🇩'
  },
  {
    code: 'SG',
    dialCode: '+65',
    name: {
      en: 'Singapore',
      th: 'สิงคโปร์',
      zh: '新加坡',
      ja: 'シンガポール',
      ko: '싱가포르',
      id: 'Singapura'
    },
    flag: '🇸🇬'
  },
  {
    code: 'MY',
    dialCode: '+60',
    name: {
      en: 'Malaysia',
      th: 'มาเลเซีย',
      zh: '马来西亚',
      ja: 'マレーシア',
      ko: '말레이시아',
      id: 'Malaysia'
    },
    flag: '🇲🇾'
  },
  {
    code: 'PH',
    dialCode: '+63',
    name: {
      en: 'Philippines',
      th: 'ฟิลิปปินส์',
      zh: '菲律宾',
      ja: 'フィリピン',
      ko: '필리핀',
      id: 'Filipina'
    },
    flag: '🇵🇭'
  },
  {
    code: 'VN',
    dialCode: '+84',
    name: {
      en: 'Vietnam',
      th: 'เวียดนาม',
      zh: '越南',
      ja: 'ベトナム',
      ko: '베트남',
      id: 'Vietnam'
    },
    flag: '🇻🇳'
  },
  {
    code: 'IN',
    dialCode: '+91',
    name: {
      en: 'India',
      th: 'อินเดีย',
      zh: '印度',
      ja: 'インド',
      ko: '인도',
      id: 'India'
    },
    flag: '🇮🇳'
  },
  {
    code: 'GB',
    dialCode: '+44',
    name: {
      en: 'United Kingdom',
      th: 'สหราชอาณาจักร',
      zh: '英国',
      ja: 'イギリス',
      ko: '영국',
      id: 'Britania Raya'
    },
    flag: '🇬🇧'
  },
  {
    code: 'AU',
    dialCode: '+61',
    name: {
      en: 'Australia',
      th: 'ออสเตรเลีย',
      zh: '澳大利亚',
      ja: 'オーストラリア',
      ko: '호주',
      id: 'Australia'
    },
    flag: '🇦🇺'
  },
  {
    code: 'CA',
    dialCode: '+1',
    name: {
      en: 'Canada',
      th: 'แคนาดา',
      zh: '加拿大',
      ja: 'カナダ',
      ko: '캐나다',
      id: 'Kanada'
    },
    flag: '🇨🇦'
  }
];

export const getCountryByDialCode = (dialCode: string): CountryCode | undefined => {
  return countryCodes.find(country => country.dialCode === dialCode);
};

export const getDefaultCountry = (): CountryCode => {
  return countryCodes.find(country => country.code === 'TH') || countryCodes[0];
}; 