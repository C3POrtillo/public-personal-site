import type { DirectionValues } from '@/components/inputs/types';
import type { UserData } from '@/components/tfd/accounts/AuthProvider';
import type { ModuleTiersType } from '@/components/tfd/module/types';
import type { Dispatch, SetStateAction } from 'react';

const wordSeparators = /[-_\\.+\s]+/g;
const notAlphaNumericOrSpace = /[^ a-zA-Z0-9]+/g;
const notAlphaNumericSpaceOrDash = /[^ a-zA-Z0-9-]/g;
const capitalizedFirstLetter = /[A-Z]+(?![a-z])|[A-Z]/g;

const cleanStringArray = (string: string): string[] => {
  const cleanedString = string
    .replace(wordSeparators, ' ')
    .replace(notAlphaNumericOrSpace, '')
    .replace(capitalizedFirstLetter, ($, ofs) => (ofs ? ' ' : '') + $.trim().toLowerCase())
    .trim();

  return cleanedString.split(' ');
};

const capitalizeFirstLetter = (string: string): string =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

export const titleCase = (string: string): string => {
  const capitalizedWords = cleanStringArray(string).map(word => capitalizeFirstLetter(word));

  return capitalizedWords.filter(str => str).join(' ');
};

export const camelCase = (string: string): string => {
  const camelCasedWords = cleanStringArray(string).map((word, index) =>
    index === 0 ? word.toLowerCase() : capitalizeFirstLetter(word),
  );

  return camelCasedWords.join('');
};

export const kebabCase = (string: string) =>
  string
    .trim()
    .replace(wordSeparators, '-')
    .replace(notAlphaNumericSpaceOrDash, '')
    .replace(capitalizedFirstLetter, ($, ofs) => (ofs ? '-' : '') + $.trim().toLowerCase())
    .replace(/--+/g, '-');

export const compareStrings = (a: string, b: string) => a.localeCompare(b);

export const sortData = (a: string | number, b: string | number, sortDirection?: DirectionValues) => {
  const isReversed = sortDirection === 2;

  if (typeof a === 'number' && typeof b === 'number') {
    if (a === 0 && b !== 0) {
      return 1;
    }
    if (b === 0 && a !== 0) {
      return -1;
    }

    return isReversed ? b - a : a - b;
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return isReversed ? compareStrings(b, a) : compareStrings(a, b);
  }

  return 0;
};

export const delimitNumber = (number: number) => Number(number.toFixed(0)).toLocaleString('en', { useGrouping: true });

export const roundToHundreth = (number: number) => number.toFixed(2);

export const addSuffixToValue = (value: string | number, string: string) => `${value}${string}`;

export const getBackgroundLinear = (tier: ModuleTiersType): string => `bg-${kebabCase(tier)}`;
export const getBackgroundRadial = (tier: ModuleTiersType): string => `${getBackgroundLinear(tier)}-radial`;

export const getLabelClass = (name: string): string => `label-${kebabCase(name)}`;

export const createLabelClass = (name: string, value: string): string => {
  switch (name) {
    case 'rounds-type':
    case 'attribute':
    case 'zone':
    case 'external_component_tier':
    case 'weapon-type':
    case 'enhance':
    case 'tier':
    case 'class':
      return getLabelClass(value);
    default:
      return getLabelClass(name);
  }
};

export const calculateAttempts = (probability: number | string) => {
  const p = (typeof probability === 'string' ? parseFloat(probability) : probability) / 100;
  if (p === 0) {
    return {
      expectedAttempts: '',
      nearlyGuaranteed: '',
      nearlyGuaranteedRange: '',
    };
  }

  const expectedAttempts = Math.ceil(1 / p).toFixed(0);
  const nearlyGuaranteedLower = Math.log(0.01) / Math.log(1 - p); // 99%;
  const nearlyGuaranteedUpper = Math.log(0.001) / Math.log(1 - p); // 99.9%;

  return {
    expectedAttempts,
    nearlyGuaranteed: Math.ceil((nearlyGuaranteedLower + nearlyGuaranteedUpper) / 2).toFixed(0),
    nearlyGuaranteedRange: Math.ceil((nearlyGuaranteedUpper - nearlyGuaranteedLower) / 2).toFixed(0),
  };
};

export const createFilterMap = (array: readonly string[]) =>
  array.reduce((acc, key) => {
    acc[key] = true;

    return acc;
  }, {} as { [key: string]: boolean });

export const compareRates = (a: string, b: string) => parseFloat(a) - parseFloat(b);

const endpoints = {
  'export-wishlist': '/api/exportWishlistData',
  'import-wishlist': '/api/importWishlistData',
  'import-all-wishlists': '/api/getAccountWishlists',
} as const;

type DataSetOptions<T> = {
  setData?: Dispatch<SetStateAction<T>>;
  setName?: Dispatch<SetStateAction<string>>;
  setError?: Dispatch<SetStateAction<boolean>>;
  type?: 'single' | 'all';
};

type SaveData = Partial<UserData> & {
  saveName?: string;
};

export const importData = async <T>(
  endpoint: keyof typeof endpoints,
  { saveName, id }: SaveData,
  options?: DataSetOptions<T>,
): Promise<T | undefined> => {
  const { setData, setError, type = 'single' } = options || {};
  try {
    setError?.(false);
    const url = endpoints[endpoint];

    let body;
    if (saveName) {
      const [saveId, ...words] = saveName.split('-');
      const name = words.join('-');
      body = JSON.stringify({ id: saveId, name });
    } else if (id) {
      body = JSON.stringify({ id });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    if (type === 'single') {
      const responseData = JSON.parse(result.data);
      setData?.(responseData);

      return responseData;
    }

    return result;
  } catch (error) {
    setError?.(false);
    console.error('Error importing data:', error);

    return undefined;
  }
};

export const exportData = async <T>(
  endpoint: keyof typeof endpoints,
  { saveName, username, id }: SaveData,
  data: T,
  options?: DataSetOptions<T>,
): Promise<string | undefined> => {
  const { setName, setError } = options || {};
  try {
    setError?.(false);
    const url = endpoints[endpoint];
    const name = kebabCase([username || 'guest', saveName].join(' '));
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, data }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }

    const resultName = `${result.id}-${result.name}`;
    setName?.(resultName);

    return resultName;
  } catch (error) {
    setError?.(true);
    console.error('Error exporting data:', error);

    return undefined;
  }
};

export const getTfdSeo = ({ title, description, slug, canonical, ...props }: Record<string, string>) => ({
  title,
  description,
  canonical: canonical ? `https://ortillo.cam/tfd${canonical}` : null,
  ...props,
  openGraph: {
    url: `https://ortillo.cam/tfd${slug || ''}`,
    title,
    description,
    images: [{ url: 'https://ortillo.cam/logo-512x512.png' }],
  },
});

export const joinStrings = (strings: (string | number | boolean | undefined | null)[]) =>
  strings.filter(string => string).join(' ');
