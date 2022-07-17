export interface Summary {
  Global: Global;
  Countries: Countries[];
}

interface Global {
  NewConfirmed: number;
  TotalConfirmed: number;
  NewDeaths: number;
  TotalDeaths: number;
  NewRecovered: number;
  TotalRecovered: number;
}

export interface Countries extends Global {
  Country: string;
  CountryCode: string;
  Slug: string;
  Date: number;
}

export interface LiveCountryInfo {
  Country: string;
  CountryCode: string;
  Cases: number;
  Status: string;
  Date: string;
}

export type status = 'confirmed' | 'recovered' | 'deaths';
