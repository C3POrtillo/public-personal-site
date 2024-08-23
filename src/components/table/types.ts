import type { ReactNode } from 'react';

type HeaderElement = {
  key: string;
  header: ReactNode;
  sortReversed?: boolean;
};

export type HeadersType = string | HeaderElement;
