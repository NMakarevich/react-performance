export function fetchCountries(): Promise<Response> {
  return fetch('https://restcountries.com/v3.1/all');
}
