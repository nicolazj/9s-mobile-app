export const currencyMaps = [
  { currency: 'GBP', symbol: '£' },
  { currency: 'NZD', symbol: '$' },
];
export const getSymbol = (currency: string) => {
  const r = currencyMaps.find(m => m.currency === currency);
  return r ? r.symbol : '$';
};
