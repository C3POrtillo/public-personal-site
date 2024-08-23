import type { ModuleTiersType } from '@/components/tfd/module/types';

export type Probability = Partial<Record<ModuleTiersType, number>>;

export const decodeChar = {
  s: 'Standard',
  r: 'Rare',
  u: 'Ultimate',
  t: 'Transcendent',
} as const;

export const probabilities = {
  ssss: {
    Standard: 90,
    Rare: 10,
  },
  sssr: {
    Standard: 67.5,
    Rare: 30,
    Ultimate: 2.5,
  },
  sssu: {
    Standard: 67.5,
    Rare: 7.5,
    Ultimate: 22.5,
    Transcendent: 2.5,
  },
  ssst: {
    Standard: 67.5,
    Rare: 7.5,
    Transcendent: 25,
  },
  ssru: {
    Standard: 45,
    Rare: 27.5,
    Ultimate: 25,
    Transcendent: 2.5,
  },
  ssrt: {
    Standard: 45,
    Rare: 27.5,
    Ultimate: 2.5,
    Transcendent: 25,
  },
  ssut: {
    Standard: 45,
    Rare: 5,
    Ultimate: 22.5,
    Transcendent: 27.5,
  },
  ssrr: {
    Standard: 45,
    Rare: 50,
    Ultimate: 5,
  },
  ssuu: {
    Standard: 45,
    Rare: 5,
    Ultimate: 45,
    Transcendent: 5,
  },
  sstt: {
    Standard: 45,
    Rare: 5,
    Transcendent: 50,
  },
  srut: {
    Standard: 22.5,
    Rare: 25,
    Ultimate: 25,
    Transcendent: 27.5,
  },
  srru: {
    Standard: 22.5,
    Rare: 47.5,
    Ultimate: 27.5,
    Transcendent: 2.5,
  },
  sruu: {
    Standard: 22.5,
    Rare: 25,
    Ultimate: 47.5,
    Transcendent: 5,
  },
  srrt: {
    Standard: 22.5,
    Rare: 47.5,
    Ultimate: 5,
    Transcendent: 25,
  },
  srtt: {
    Standard: 22.5,
    Rare: 25,
    Ultimate: 2.5,
    Transcendent: 50,
  },
  suut: {
    Standard: 22.5,
    Rare: 2.5,
    Ultimate: 45,
    Transcendent: 30,
  },
  sutt: {
    Standard: 22.5,
    Rare: 2.5,
    Ultimate: 22.5,
    Transcendent: 52.5,
  },
  srrr: {
    Standard: 22.5,
    Rare: 70,
    Ultimate: 7.5,
  },
  suuu: {
    Standard: 22.5,
    Rare: 2.5,
    Ultimate: 67.5,
    Transcendent: 7.5,
  },
  sttt: {
    Standard: 22.5,
    Rare: 2.5,
    Transcendent: 75,
  },
  rrrr: {
    Rare: 90,
    Ultimate: 10,
  },
  rrru: {
    Rare: 67.5,
    Ultimate: 30,
    Transcendent: 2.5,
  },
  rrrt: {
    Rare: 67.5,
    Ultimate: 7.5,
    Transcendent: 25,
  },
  rrut: {
    Rare: 45,
    Ultimate: 27.5,
    Transcendent: 27.5,
  },
  rruu: {
    Rare: 45,
    Ultimate: 50,
    Transcendent: 5,
  },
  rrtt: {
    Rare: 45,
    Ultimate: 5,
    Transcendent: 50,
  },
  ruuu: {
    Rare: 22.5,
    Ultimate: 70,
    Transcendent: 7.5,
  },
  rttt: {
    Rare: 22.5,
    Ultimate: 2.5,
    Transcendent: 75,
  },
  rutt: {
    Rare: 22.5,
    Ultimate: 25,
    Transcendent: 52.5,
  },
  ruut: {
    Rare: 22.5,
    Ultimate: 47.5,
    Transcendent: 30,
  },
  uuuu: {
    Ultimate: 90,
    Transcendent: 10,
  },
  uuut: {
    Ultimate: 67.5,
    Transcendent: 32.5,
  },
  uutt: {
    Ultimate: 45,
    Transcendent: 55,
  },
  uttt: {
    Ultimate: 22.5,
    Transcendent: 77.5,
  },
  tttt: {
    Transcendent: 100,
  },
} as Record<string, Probability>;
