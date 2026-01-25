// Country data for country/state fields

export interface Country {
  code: string;
  name: string;
}

export interface State {
  code: string;
  name: string;
  countryCode: string;
}

// ISO 3166-1 alpha-2 country codes - most common countries
export const countries: Country[] = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "PH", name: "Philippines" },
  { code: "ID", name: "Indonesia" },
  { code: "VN", name: "Vietnam" },
  { code: "ZA", name: "South Africa" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "IL", name: "Israel" },
  { code: "TR", name: "Turkey" },
  { code: "RU", name: "Russia" },
  { code: "UA", name: "Ukraine" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
];

// US States
export const usStates: State[] = [
  { code: "AL", name: "Alabama", countryCode: "US" },
  { code: "AK", name: "Alaska", countryCode: "US" },
  { code: "AZ", name: "Arizona", countryCode: "US" },
  { code: "AR", name: "Arkansas", countryCode: "US" },
  { code: "CA", name: "California", countryCode: "US" },
  { code: "CO", name: "Colorado", countryCode: "US" },
  { code: "CT", name: "Connecticut", countryCode: "US" },
  { code: "DE", name: "Delaware", countryCode: "US" },
  { code: "FL", name: "Florida", countryCode: "US" },
  { code: "GA", name: "Georgia", countryCode: "US" },
  { code: "HI", name: "Hawaii", countryCode: "US" },
  { code: "ID", name: "Idaho", countryCode: "US" },
  { code: "IL", name: "Illinois", countryCode: "US" },
  { code: "IN", name: "Indiana", countryCode: "US" },
  { code: "IA", name: "Iowa", countryCode: "US" },
  { code: "KS", name: "Kansas", countryCode: "US" },
  { code: "KY", name: "Kentucky", countryCode: "US" },
  { code: "LA", name: "Louisiana", countryCode: "US" },
  { code: "ME", name: "Maine", countryCode: "US" },
  { code: "MD", name: "Maryland", countryCode: "US" },
  { code: "MA", name: "Massachusetts", countryCode: "US" },
  { code: "MI", name: "Michigan", countryCode: "US" },
  { code: "MN", name: "Minnesota", countryCode: "US" },
  { code: "MS", name: "Mississippi", countryCode: "US" },
  { code: "MO", name: "Missouri", countryCode: "US" },
  { code: "MT", name: "Montana", countryCode: "US" },
  { code: "NE", name: "Nebraska", countryCode: "US" },
  { code: "NV", name: "Nevada", countryCode: "US" },
  { code: "NH", name: "New Hampshire", countryCode: "US" },
  { code: "NJ", name: "New Jersey", countryCode: "US" },
  { code: "NM", name: "New Mexico", countryCode: "US" },
  { code: "NY", name: "New York", countryCode: "US" },
  { code: "NC", name: "North Carolina", countryCode: "US" },
  { code: "ND", name: "North Dakota", countryCode: "US" },
  { code: "OH", name: "Ohio", countryCode: "US" },
  { code: "OK", name: "Oklahoma", countryCode: "US" },
  { code: "OR", name: "Oregon", countryCode: "US" },
  { code: "PA", name: "Pennsylvania", countryCode: "US" },
  { code: "RI", name: "Rhode Island", countryCode: "US" },
  { code: "SC", name: "South Carolina", countryCode: "US" },
  { code: "SD", name: "South Dakota", countryCode: "US" },
  { code: "TN", name: "Tennessee", countryCode: "US" },
  { code: "TX", name: "Texas", countryCode: "US" },
  { code: "UT", name: "Utah", countryCode: "US" },
  { code: "VT", name: "Vermont", countryCode: "US" },
  { code: "VA", name: "Virginia", countryCode: "US" },
  { code: "WA", name: "Washington", countryCode: "US" },
  { code: "WV", name: "West Virginia", countryCode: "US" },
  { code: "WI", name: "Wisconsin", countryCode: "US" },
  { code: "WY", name: "Wyoming", countryCode: "US" },
  { code: "DC", name: "District of Columbia", countryCode: "US" },
];

// Canadian Provinces
export const caProvinces: State[] = [
  { code: "AB", name: "Alberta", countryCode: "CA" },
  { code: "BC", name: "British Columbia", countryCode: "CA" },
  { code: "MB", name: "Manitoba", countryCode: "CA" },
  { code: "NB", name: "New Brunswick", countryCode: "CA" },
  { code: "NL", name: "Newfoundland and Labrador", countryCode: "CA" },
  { code: "NS", name: "Nova Scotia", countryCode: "CA" },
  { code: "ON", name: "Ontario", countryCode: "CA" },
  { code: "PE", name: "Prince Edward Island", countryCode: "CA" },
  { code: "QC", name: "Quebec", countryCode: "CA" },
  { code: "SK", name: "Saskatchewan", countryCode: "CA" },
  { code: "NT", name: "Northwest Territories", countryCode: "CA" },
  { code: "NU", name: "Nunavut", countryCode: "CA" },
  { code: "YT", name: "Yukon", countryCode: "CA" },
];

// Get states for a country
export function getStatesForCountry(countryCode: string): State[] {
  switch (countryCode) {
    case "US":
      return usStates;
    case "CA":
      return caProvinces;
    default:
      return [];
  }
}

// Get country by code
export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}

// Get state by code
export function getStateByCode(
  stateCode: string,
  countryCode: string,
): State | undefined {
  const states = getStatesForCountry(countryCode);
  return states.find((s) => s.code === stateCode);
}
