export interface Hotel {
  id: number;
  name: string;
  img: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
}

export type HotelsMap = Record<string, Hotel>;

export interface TourCardData {
  priceId: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  hotel: Hotel;
}
