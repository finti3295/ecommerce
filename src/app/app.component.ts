import { Component } from '@angular/core';
import firebase from 'firebase';
import { TypedJSON } from 'typedjson';
import { Country, CountryResult } from './models/country.model';
import { NodefetchService } from './services/nodefetch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce';
  constructor(private nodeFetchService: NodefetchService){
    const firebaseConfig = {
      apiKey: "AIzaSyCgY-N3hLOCltQq30TQEhaLNyXF9dxXjwo",
      authDomain: "posts-a6997.firebaseapp.com",
      databaseURL: "https://posts-a6997-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "posts-a6997",
      storageBucket: "posts-a6997.appspot.com",
      messagingSenderId: "601468590038",
      appId: "1:601468590038:web:bc18d2d1ff5980f6873677",
      measurementId: "G-NK3FJXK5D9"
    };
    firebase.initializeApp(firebaseConfig);   
    this.nodeFetchService.getCountries();
  }
}
