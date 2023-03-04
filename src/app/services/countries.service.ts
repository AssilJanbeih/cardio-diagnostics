import { Injectable } from "@angular/core";
import { Country } from "src/app/models/countries";
import * as countryList from "countries-list";

interface countryList {
  [prop: string]: { name: string; phone: string; languages: string[] };
}
@Injectable({
  providedIn: "root",
})
export class CountriesService {
  countries: Country[] = [];
  constructor() {
    this.getCountries();
  }

  getCountries() {
    const country: countryList = countryList.countries;
    Object.keys(country).forEach((key) => {
      this.countries.push({
        name: country[key].name,
        phone: country[key].phone,
        languages: country[key].languages,
        code: key,
      });
    });
  }
}
