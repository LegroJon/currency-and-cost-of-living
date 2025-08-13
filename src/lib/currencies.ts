// Complete ISO-4217 currency minor units mapping
// Last updated: August 2025 (refresh weekly as per instructions)

export const currencyMinorUnits: Record<string, number> = {
  // Major currencies
  USD: 2, // US Dollar
  EUR: 2, // Euro
  GBP: 2, // British Pound
  JPY: 0, // Japanese Yen
  CHF: 2, // Swiss Franc
  CAD: 2, // Canadian Dollar
  AUD: 2, // Australian Dollar
  NZD: 2, // New Zealand Dollar
  CNY: 2, // Chinese Yuan
  SEK: 2, // Swedish Krona
  NOK: 2, // Norwegian Krone
  DKK: 2, // Danish Krone
  
  // Americas
  ARS: 2, // Argentine Peso
  BOB: 2, // Bolivian Boliviano
  BRL: 2, // Brazilian Real
  CLP: 0, // Chilean Peso
  COP: 2, // Colombian Peso
  CRC: 2, // Costa Rican Colón
  CUP: 2, // Cuban Peso
  DOP: 2, // Dominican Peso
  GTQ: 2, // Guatemalan Quetzal
  HNL: 2, // Honduran Lempira
  JMD: 2, // Jamaican Dollar
  MXN: 2, // Mexican Peso
  NIO: 2, // Nicaraguan Córdoba
  PAB: 2, // Panamanian Balboa
  PEN: 2, // Peruvian Sol
  PYG: 0, // Paraguayan Guaraní
  SVC: 2, // Salvadoran Colón
  TTD: 2, // Trinidad and Tobago Dollar
  UYU: 2, // Uruguayan Peso
  VED: 2, // Venezuelan Bolívar Digital
  VES: 2, // Venezuelan Bolívar Soberano
  
  // Europe
  ALL: 2, // Albanian Lek
  BAM: 2, // Bosnia-Herzegovina Convertible Mark
  BGN: 2, // Bulgarian Lev
  CZK: 2, // Czech Koruna
  HRK: 2, // Croatian Kuna
  HUF: 2, // Hungarian Forint
  ISK: 0, // Icelandic Króna
  MDL: 2, // Moldovan Leu
  MKD: 2, // Macedonian Denar
  PLN: 2, // Polish Złoty
  RON: 2, // Romanian Leu
  RSD: 2, // Serbian Dinar
  RUB: 2, // Russian Ruble
  TRY: 2, // Turkish Lira
  UAH: 2, // Ukrainian Hryvnia
  
  // Asia-Pacific
  AFN: 2, // Afghan Afghani
  BDT: 2, // Bangladeshi Taka
  BTN: 2, // Bhutanese Ngultrum
  BND: 2, // Brunei Dollar
  KHR: 2, // Cambodian Riel
  FJD: 2, // Fijian Dollar
  HKD: 2, // Hong Kong Dollar
  INR: 2, // Indian Rupee
  IDR: 2, // Indonesian Rupiah
  KZT: 2, // Kazakhstani Tenge
  KGS: 2, // Kyrgyzstani Som
  LAK: 2, // Lao Kip
  MOP: 2, // Macanese Pataca
  MYR: 2, // Malaysian Ringgit
  MVR: 2, // Maldivian Rufiyaa
  MNT: 2, // Mongolian Tögrög
  MMK: 2, // Myanmar Kyat
  NPR: 2, // Nepalese Rupee
  KPW: 2, // North Korean Won
  PKR: 2, // Pakistani Rupee
  PGK: 2, // Papua New Guinean Kina
  PHP: 2, // Philippine Peso
  SGD: 2, // Singapore Dollar
  LKR: 2, // Sri Lankan Rupee
  TWD: 2, // New Taiwan Dollar
  TJS: 2, // Tajikistani Somoni
  THB: 2, // Thai Baht
  TMT: 2, // Turkmenistani Manat
  UZS: 2, // Uzbekistani Som
  VND: 0, // Vietnamese Đồng
  KRW: 0, // South Korean Won
  
  // Middle East
  BHD: 3, // Bahraini Dinar
  ILS: 2, // Israeli New Shekel
  IQD: 3, // Iraqi Dinar
  IRR: 2, // Iranian Rial
  JOD: 3, // Jordanian Dinar
  KWD: 3, // Kuwaiti Dinar
  LBP: 2, // Lebanese Pound
  OMR: 3, // Omani Rial
  QAR: 2, // Qatari Riyal
  SAR: 2, // Saudi Riyal
  SYP: 2, // Syrian Pound
  AED: 2, // UAE Dirham
  YER: 2, // Yemeni Rial
  
  // Africa
  DZD: 2, // Algerian Dinar
  AOA: 2, // Angolan Kwanza
  BWP: 2, // Botswanan Pula
  BIF: 0, // Burundian Franc
  CVE: 2, // Cape Verdean Escudo
  XAF: 0, // Central African CFA Franc
  KMF: 0, // Comorian Franc
  CDF: 2, // Congolese Franc
  DJF: 0, // Djiboutian Franc
  EGP: 2, // Egyptian Pound
  ERN: 2, // Eritrean Nakfa
  SZL: 2, // Eswatini Lilangeni
  ETB: 2, // Ethiopian Birr
  GMD: 2, // Gambian Dalasi
  GHS: 2, // Ghanaian Cedi
  GNF: 0, // Guinean Franc
  KES: 2, // Kenyan Shilling
  LSL: 2, // Lesotho Loti
  LRD: 2, // Liberian Dollar
  LYD: 3, // Libyan Dinar
  MGA: 2, // Malagasy Ariary
  MWK: 2, // Malawian Kwacha
  MRU: 2, // Mauritanian Ouguiya
  MUR: 2, // Mauritian Rupee
  MAD: 2, // Moroccan Dirham
  MZN: 2, // Mozambican Metical
  NAD: 2, // Namibian Dollar
  NGN: 2, // Nigerian Naira
  RWF: 0, // Rwandan Franc
  STN: 2, // São Tomé and Príncipe Dobra
  SCR: 2, // Seychellois Rupee
  SLE: 2, // Sierra Leonean Leone
  SOS: 2, // Somali Shilling
  ZAR: 2, // South African Rand
  SSP: 2, // South Sudanese Pound
  SDG: 2, // Sudanese Pound
  TZS: 2, // Tanzanian Shilling
  TND: 3, // Tunisian Dinar
  UGX: 0, // Ugandan Shilling
  XOF: 0, // West African CFA Franc
  ZMW: 2, // Zambian Kwacha
  ZWL: 2, // Zimbabwean Dollar
  
  // Oceania & Others
  SBD: 2, // Solomon Islands Dollar
  TOP: 2, // Tongan Pa'anga
  VUV: 0, // Vanuatu Vatu
  WST: 2, // Samoan Tala
  
  // Special Drawing Rights & Precious Metals
  XDR: 5, // SDR (Special Drawing Rights)
  XAG: 2, // Silver
  XAU: 4, // Gold
  XPD: 2, // Palladium
  XPT: 2, // Platinum
};

// Get minor units for a currency, default to 2 if unknown
export function getMinorUnits(currency: string): number {
  return currencyMinorUnits[currency.toUpperCase()] ?? 2;
}

// List of all supported currencies
export const supportedCurrencies = Object.keys(currencyMinorUnits).sort();

// Weekly refresh reminder - update this list every week
export const lastUpdated = "2025-08-10";
