export type GeoEntityType = 'country' | 'city' | 'hotel';

export interface Country {
  id: string;
  name: string;
  flag?: string;
}

export interface City {
  id: number;
  name: string;
  countryId: string;
}

export interface Hotel {
  id: number;
  name: string;
  img?: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
}

export interface GeoEntity {
  id: string | number;
  name: string;
  type: GeoEntityType;
  flag?: string;
  img?: string;
  cityName?: string;
  countryName?: string;
  countryId?: string;
}

export type CountriesMap = Record<string, Country>;

export type GeoResponse = Record<string, GeoEntity>;
