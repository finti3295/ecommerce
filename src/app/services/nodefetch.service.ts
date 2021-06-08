import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TypedJSON } from 'typedjson';
import { City, CityResult, Country, CountryResult } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class NodefetchService {
  countries: Country[] = [];
  countrySubject = new Subject<Country[]>()

  cities:City[] = [];
  citySubject = new Subject<City[]>();

  constructor(private http: HttpClient) { }

   getCities(countryId:string){
    console.log('countryId '+countryId);
    return new Promise(
      ( resolve, reject) => {
        const where = encodeURIComponent(JSON.stringify({
          "country": {
            "__type": "Pointer",
            "className": "Continentscountriescities_Country",
            "objectId": `${countryId}`
          }
        }));
        const httpOptions = {
          headers: new HttpHeaders({
            'X-Parse-Application-Id': 'zrMEBOk6PBk3WmUF19TVTB1yxKaTc9PnwYsxTThs', // This is your app's application id
            'X-Parse-REST-API-Key': 'zdDm1gbxIFjmOKSEJTR8sDcGkdBM8CDRJXUbKFzD', // This is your app's REST API key
          })
        };
        this.http.
        get(`https://parseapi.back4app.com/classes/Continentscountriescities_City?limit=10000&keys=name&where=${where}`,
        httpOptions ).subscribe(
          response => {
            const serializer = new TypedJSON(CityResult);
      
            var c= serializer.parse(response);// JSON.parse(jsonString)
            if(c != undefined){
             {
              this.cities = c.results
              this.emitCities();
              resolve(true);
             //console.log('async1 cities '+response);
             }
        
            }
          //  console.log('async countries '+response);
          reject("Error getting cities")
            this.emitCities();
          }
        );
      }
    );
   
  }

  getCountries() {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Parse-Application-Id': 'zrMEBOk6PBk3WmUF19TVTB1yxKaTc9PnwYsxTThs', // This is your app's application id
        'X-Parse-REST-API-Key': 'zdDm1gbxIFjmOKSEJTR8sDcGkdBM8CDRJXUbKFzD', // This is your app's REST API key
      })
    };
    this.http.
    get(`https://parseapi.back4app.com/classes/Continentscountriescities_Country?limit=1000&order=name&keys=name,phone`,
    httpOptions ).subscribe(
      response => {
        const serializer = new TypedJSON(CountryResult);
  
        var c= serializer.parse(response);// JSON.parse(jsonString)
        if(c != undefined){
         {
          this.countries = c.results
          this.emitCountries();
         console.log('async1 countries '+ this.countries.length);
         }
    
        }
      //  console.log('async countries '+response);
        this.emitCountries();
      }
    );

   
  }

  

 async getCountries1(){
    return new Promise(
      (resolve, reject) =>{
        if(this.countries.length != 0)
        resolve(true)
        else{
          const fetch = require('node-fetch');
      
          (async () => {
            const response = await fetch(
              'https://parseapi.back4app.com/classes/Continentscountriescities_Country?limit=1000&order=name&keys=name,phone',
              {
                headers: {
                  'X-Parse-Application-Id': 'zrMEBOk6PBk3WmUF19TVTB1yxKaTc9PnwYsxTThs', // This is your app's application id
                  'X-Parse-REST-API-Key': 'zdDm1gbxIFjmOKSEJTR8sDcGkdBM8CDRJXUbKFzD', // This is your app's REST API key
                }
              }
            );
            const data = await response.json(); // Here you have the data that you need
    
            const serializer = new TypedJSON(CountryResult);
          
            var c= serializer.parse(data);// JSON.parse(jsonString)
            if(c != undefined){
             {
              this.countries = c.results
             this.emitCountries();
             resolve(true);
             //console.log(JSON.stringify(data, null, 2));
            //  this.countries.forEach(function(x){
            //   console.log('x data '+x.phone);
            //  });
             //console.log(JSON.stringify(this.countries, null, 2));
             //console.log('async response '+ this.countries.toString);
            //  console.log('async data '+data);
             }
        
            }
            console.log('async countries '+this. countries.length);
            this.emitCountries();
         reject("Countries not loaded");
        
          })();}
      
      }
    )


   
  }

  emitCountries() {
    this.countrySubject.next(this.countries);
  }

  emitCities() {
    this.citySubject.next(this.cities);
  }
}


