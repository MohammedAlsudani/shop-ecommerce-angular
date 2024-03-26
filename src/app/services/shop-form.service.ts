import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries'
  private stateUrl = 'http://localhost:8080/api/states'

  constructor(private httpClient:HttpClient) { }

  getCountries():Observable<Country[]> {
    return this.httpClient.get<GetResponseCountrues>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  
  getStates(countryCode: string):Observable<State[]> {
    const searchStateUrl = `${this.stateUrl}/search/findByCountryCode?code=${countryCode}`
    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  
  getCreditCardMonths(startMonth:number): Observable<number[]> {
    let data:number[] = [];
    // build an array for "Months" list start with startMonth till 
    // till last month
    for (let month = startMonth; month <= 12; month++) {
      data.push(month)
    }
    return of(data)
  }




  getCreditCarYears(): Observable<number[]> {
    let data:number[] = [];
    // build an array for "Year" list start at current year
    //  and loop for next 10 years
    const startYear:number = new Date().getFullYear();
    const endYear:number = startYear+10;
    for (let year = startYear; year <= endYear; year++) {
      data.push(year)
    }
    return of(data)
  }
}

interface GetResponseCountrues {
  _embedded:{
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded:{
    states: State[];
  }
}
