import { attributesArray } from '@/utils/attributes/types';

export const sortAttributes = (a: string, b: string) =>
  attributesArray.findIndex(priority => a === priority) - attributesArray.findIndex(priority => b === priority);
