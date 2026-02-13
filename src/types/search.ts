export type SearchStatus = 'idle' | 'loading' | 'polling' | 'success' | 'error' | 'empty';

export interface PriceOffer {
  id: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  hotelID?: string;
}

export type PricesMap = Record<string, PriceOffer>;

export interface StartSearchResponse {
  token: string;
  waitUntil: string;
}

export interface SearchError {
  code: number;
  error: boolean;
  message: string;
  waitUntil?: string;
}

export interface GetSearchPricesResponse {
  prices: PricesMap;
}
