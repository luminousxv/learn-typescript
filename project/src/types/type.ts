export interface Summary {
  data: {
    Global: Global;
    Countries: Countries[];
  };
}

interface Global extends DeathRecovered {
  NewConfirmed: number;
  TotalConfirmed: number;
}

interface Countries extends Global {
  Country: string;
  CountryCode: string;
  Slug: string;
  Date: number;
}

interface DeathRecovered {
  NewDeaths: number;
  TotalDeaths: number;
  NewRecovered: number;
  TotalRecovered: number;
}

export interface LiveCountryInfo {
  data: Info[];
}

interface Info {
  Country: string;
  CountryCode: string;
  Cases: number;
  Status: string;
  Date: string;
}

export type status = 'confirmed' | 'recovered' | 'deaths';
