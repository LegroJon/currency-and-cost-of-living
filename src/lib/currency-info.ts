// Currency display names and metadata
// Maps currency codes to human-readable information

export interface CurrencyInfo {
  code: string;
  name: string;
  country: string;
  symbol?: string;
}

export const currencyInfo: Record<string, CurrencyInfo> = {
  // Major currencies
  USD: { code: "USD", name: "US Dollar", country: "United States", symbol: "$" },
  EUR: { code: "EUR", name: "Euro", country: "European Union", symbol: "€" },
  GBP: { code: "GBP", name: "British Pound", country: "United Kingdom", symbol: "£" },
  JPY: { code: "JPY", name: "Japanese Yen", country: "Japan", symbol: "¥" },
  CHF: { code: "CHF", name: "Swiss Franc", country: "Switzerland", symbol: "CHF" },
  CAD: { code: "CAD", name: "Canadian Dollar", country: "Canada", symbol: "C$" },
  AUD: { code: "AUD", name: "Australian Dollar", country: "Australia", symbol: "A$" },
  NZD: { code: "NZD", name: "New Zealand Dollar", country: "New Zealand", symbol: "NZ$" },
  CNY: { code: "CNY", name: "Chinese Yuan", country: "China", symbol: "¥" },
  SEK: { code: "SEK", name: "Swedish Krona", country: "Sweden", symbol: "kr" },
  NOK: { code: "NOK", name: "Norwegian Krone", country: "Norway", symbol: "kr" },
  DKK: { code: "DKK", name: "Danish Krone", country: "Denmark", symbol: "kr" },
  
  // Americas
  ARS: { code: "ARS", name: "Argentine Peso", country: "Argentina", symbol: "$" },
  BOB: { code: "BOB", name: "Bolivian Boliviano", country: "Bolivia", symbol: "Bs" },
  BRL: { code: "BRL", name: "Brazilian Real", country: "Brazil", symbol: "R$" },
  CLP: { code: "CLP", name: "Chilean Peso", country: "Chile", symbol: "$" },
  COP: { code: "COP", name: "Colombian Peso", country: "Colombia", symbol: "$" },
  CRC: { code: "CRC", name: "Costa Rican Colón", country: "Costa Rica", symbol: "₡" },
  CUP: { code: "CUP", name: "Cuban Peso", country: "Cuba", symbol: "$" },
  DOP: { code: "DOP", name: "Dominican Peso", country: "Dominican Republic", symbol: "$" },
  GTQ: { code: "GTQ", name: "Guatemalan Quetzal", country: "Guatemala", symbol: "Q" },
  HNL: { code: "HNL", name: "Honduran Lempira", country: "Honduras", symbol: "L" },
  JMD: { code: "JMD", name: "Jamaican Dollar", country: "Jamaica", symbol: "J$" },
  MXN: { code: "MXN", name: "Mexican Peso", country: "Mexico", symbol: "$" },
  NIO: { code: "NIO", name: "Nicaraguan Córdoba", country: "Nicaragua", symbol: "C$" },
  PAB: { code: "PAB", name: "Panamanian Balboa", country: "Panama", symbol: "B/." },
  PEN: { code: "PEN", name: "Peruvian Sol", country: "Peru", symbol: "S/." },
  PYG: { code: "PYG", name: "Paraguayan Guaraní", country: "Paraguay", symbol: "₲" },
  SVC: { code: "SVC", name: "Salvadoran Colón", country: "El Salvador", symbol: "$" },
  TTD: { code: "TTD", name: "Trinidad and Tobago Dollar", country: "Trinidad and Tobago", symbol: "TT$" },
  UYU: { code: "UYU", name: "Uruguayan Peso", country: "Uruguay", symbol: "$U" },
  VED: { code: "VED", name: "Venezuelan Bolívar Digital", country: "Venezuela", symbol: "Bs.D" },
  VES: { code: "VES", name: "Venezuelan Bolívar Soberano", country: "Venezuela", symbol: "Bs.S" },
  
  // Europe
  ALL: { code: "ALL", name: "Albanian Lek", country: "Albania", symbol: "L" },
  BAM: { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark", country: "Bosnia and Herzegovina", symbol: "KM" },
  BGN: { code: "BGN", name: "Bulgarian Lev", country: "Bulgaria", symbol: "лв" },
  CZK: { code: "CZK", name: "Czech Koruna", country: "Czech Republic", symbol: "Kč" },
  HRK: { code: "HRK", name: "Croatian Kuna", country: "Croatia", symbol: "kn" },
  HUF: { code: "HUF", name: "Hungarian Forint", country: "Hungary", symbol: "Ft" },
  ISK: { code: "ISK", name: "Icelandic Króna", country: "Iceland", symbol: "kr" },
  MDL: { code: "MDL", name: "Moldovan Leu", country: "Moldova", symbol: "L" },
  MKD: { code: "MKD", name: "Macedonian Denar", country: "North Macedonia", symbol: "ден" },
  PLN: { code: "PLN", name: "Polish Złoty", country: "Poland", symbol: "zł" },
  RON: { code: "RON", name: "Romanian Leu", country: "Romania", symbol: "lei" },
  RSD: { code: "RSD", name: "Serbian Dinar", country: "Serbia", symbol: "дин" },
  RUB: { code: "RUB", name: "Russian Ruble", country: "Russia", symbol: "₽" },
  TRY: { code: "TRY", name: "Turkish Lira", country: "Turkey", symbol: "₺" },
  UAH: { code: "UAH", name: "Ukrainian Hryvnia", country: "Ukraine", symbol: "₴" },
  
  // Asia-Pacific
  AFN: { code: "AFN", name: "Afghan Afghani", country: "Afghanistan", symbol: "؋" },
  BDT: { code: "BDT", name: "Bangladeshi Taka", country: "Bangladesh", symbol: "৳" },
  BTN: { code: "BTN", name: "Bhutanese Ngultrum", country: "Bhutan", symbol: "Nu." },
  BND: { code: "BND", name: "Brunei Dollar", country: "Brunei", symbol: "B$" },
  KHR: { code: "KHR", name: "Cambodian Riel", country: "Cambodia", symbol: "៛" },
  FJD: { code: "FJD", name: "Fijian Dollar", country: "Fiji", symbol: "FJ$" },
  HKD: { code: "HKD", name: "Hong Kong Dollar", country: "Hong Kong", symbol: "HK$" },
  INR: { code: "INR", name: "Indian Rupee", country: "India", symbol: "₹" },
  IDR: { code: "IDR", name: "Indonesian Rupiah", country: "Indonesia", symbol: "Rp" },
  KZT: { code: "KZT", name: "Kazakhstani Tenge", country: "Kazakhstan", symbol: "₸" },
  KGS: { code: "KGS", name: "Kyrgyzstani Som", country: "Kyrgyzstan", symbol: "лв" },
  LAK: { code: "LAK", name: "Lao Kip", country: "Laos", symbol: "₭" },
  MOP: { code: "MOP", name: "Macanese Pataca", country: "Macau", symbol: "MOP$" },
  MYR: { code: "MYR", name: "Malaysian Ringgit", country: "Malaysia", symbol: "RM" },
  MVR: { code: "MVR", name: "Maldivian Rufiyaa", country: "Maldives", symbol: "Rf" },
  MNT: { code: "MNT", name: "Mongolian Tögrög", country: "Mongolia", symbol: "₮" },
  MMK: { code: "MMK", name: "Myanmar Kyat", country: "Myanmar", symbol: "Ks" },
  NPR: { code: "NPR", name: "Nepalese Rupee", country: "Nepal", symbol: "Rs" },
  KPW: { code: "KPW", name: "North Korean Won", country: "North Korea", symbol: "₩" },
  PKR: { code: "PKR", name: "Pakistani Rupee", country: "Pakistan", symbol: "Rs" },
  PGK: { code: "PGK", name: "Papua New Guinean Kina", country: "Papua New Guinea", symbol: "K" },
  PHP: { code: "PHP", name: "Philippine Peso", country: "Philippines", symbol: "₱" },
  SGD: { code: "SGD", name: "Singapore Dollar", country: "Singapore", symbol: "S$" },
  LKR: { code: "LKR", name: "Sri Lankan Rupee", country: "Sri Lanka", symbol: "Rs" },
  TWD: { code: "TWD", name: "New Taiwan Dollar", country: "Taiwan", symbol: "NT$" },
  TJS: { code: "TJS", name: "Tajikistani Somoni", country: "Tajikistan", symbol: "ЅМ" },
  THB: { code: "THB", name: "Thai Baht", country: "Thailand", symbol: "฿" },
  TMT: { code: "TMT", name: "Turkmenistani Manat", country: "Turkmenistan", symbol: "T" },
  UZS: { code: "UZS", name: "Uzbekistani Som", country: "Uzbekistan", symbol: "лв" },
  VND: { code: "VND", name: "Vietnamese Đồng", country: "Vietnam", symbol: "₫" },
  KRW: { code: "KRW", name: "South Korean Won", country: "South Korea", symbol: "₩" },
  
  // Middle East
  BHD: { code: "BHD", name: "Bahraini Dinar", country: "Bahrain", symbol: ".د.ب" },
  ILS: { code: "ILS", name: "Israeli New Shekel", country: "Israel", symbol: "₪" },
  IQD: { code: "IQD", name: "Iraqi Dinar", country: "Iraq", symbol: "ع.د" },
  IRR: { code: "IRR", name: "Iranian Rial", country: "Iran", symbol: "﷼" },
  JOD: { code: "JOD", name: "Jordanian Dinar", country: "Jordan", symbol: "د.ا" },
  KWD: { code: "KWD", name: "Kuwaiti Dinar", country: "Kuwait", symbol: "د.ك" },
  LBP: { code: "LBP", name: "Lebanese Pound", country: "Lebanon", symbol: "ل.ل" },
  OMR: { code: "OMR", name: "Omani Rial", country: "Oman", symbol: "ر.ع." },
  QAR: { code: "QAR", name: "Qatari Riyal", country: "Qatar", symbol: "ر.ق" },
  SAR: { code: "SAR", name: "Saudi Riyal", country: "Saudi Arabia", symbol: "ر.س" },
  SYP: { code: "SYP", name: "Syrian Pound", country: "Syria", symbol: "£" },
  AED: { code: "AED", name: "UAE Dirham", country: "United Arab Emirates", symbol: "د.إ" },
  YER: { code: "YER", name: "Yemeni Rial", country: "Yemen", symbol: "﷼" },
  
  // Africa (selection of major ones)
  DZD: { code: "DZD", name: "Algerian Dinar", country: "Algeria", symbol: "د.ج" },
  AOA: { code: "AOA", name: "Angolan Kwanza", country: "Angola", symbol: "Kz" },
  BWP: { code: "BWP", name: "Botswanan Pula", country: "Botswana", symbol: "P" },
  EGP: { code: "EGP", name: "Egyptian Pound", country: "Egypt", symbol: "£" },
  ETB: { code: "ETB", name: "Ethiopian Birr", country: "Ethiopia", symbol: "Br" },
  GHS: { code: "GHS", name: "Ghanaian Cedi", country: "Ghana", symbol: "₵" },
  KES: { code: "KES", name: "Kenyan Shilling", country: "Kenya", symbol: "Sh" },
  MAD: { code: "MAD", name: "Moroccan Dirham", country: "Morocco", symbol: "د.م." },
  MUR: { code: "MUR", name: "Mauritian Rupee", country: "Mauritius", symbol: "Rs" },
  NGN: { code: "NGN", name: "Nigerian Naira", country: "Nigeria", symbol: "₦" },
  ZAR: { code: "ZAR", name: "South African Rand", country: "South Africa", symbol: "R" },
  TND: { code: "TND", name: "Tunisian Dinar", country: "Tunisia", symbol: "د.ت" },
  UGX: { code: "UGX", name: "Ugandan Shilling", country: "Uganda", symbol: "Sh" },
};

// Get currency info by code
export function getCurrencyInfo(code: string): CurrencyInfo | undefined {
  return currencyInfo[code.toUpperCase()];
}

// Get all currencies sorted by popularity/usage
export function getAllCurrencies(): CurrencyInfo[] {
  // Major currencies first, then alphabetical
  const major = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY'];
  const majorCurrencies = major.map(code => currencyInfo[code]).filter(Boolean);
  const otherCurrencies = Object.values(currencyInfo)
    .filter(curr => !major.includes(curr.code))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  return [...majorCurrencies, ...otherCurrencies];
}

// Search currencies by code, name, or country
export function searchCurrencies(query: string): CurrencyInfo[] {
  const q = query.toLowerCase();
  return Object.values(currencyInfo).filter(curr =>
    curr.code.toLowerCase().includes(q) ||
    curr.name.toLowerCase().includes(q) ||
    curr.country.toLowerCase().includes(q)
  );
}
