import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { City, Country } from 'src/app/models/country.model';
import { NodefetchService } from 'src/app/services/nodefetch.service';
import { ProductsService } from 'src/app/services/products.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm: any ;
  errorMessage!: string ; 
  hideBilling: boolean = true;
  countries: Country[] = [];
  countriesSubscription = new Subscription;

  cities: City[] = [];
  citiesSubscription = new Subscription;

  SelCountryId:Country = new Country(); 


  constructor(private formBuilder: FormBuilder, private productService: ProductsService,
     private nodeFetchService: NodefetchService, private router: Router) { }

  ngOnInit() {
    this.initForm();
   
    this.countriesSubscription = this.nodeFetchService.countrySubject.subscribe(
    (c: any[]) => {
        this.countries = c;
      }
    )

    this.citiesSubscription = this.nodeFetchService.citySubject.subscribe(
      (b: any[]) => {
          this.cities = b;
        }
      )

      this.countries = this.nodeFetchService.countries;

      console.log("initForm "+this.nodeFetchService.cities.length);

  }


  FillCities(){
this.nodeFetchService.getCities(this.SelCountryId.objectId).then(
  (x) => {
   // this.cities = this.nodeFetchService.cities;
  // console.log("FillCities "+this.cities.length);
   console.log("nodeFetchService Cities "+this.nodeFetchService.cities.length);
  }
)
  }
  initForm(){
    this.signUpForm = this.formBuilder.group(
{
  name: ['', [Validators.required]],
  surname: ['', [Validators.required]],
  phoneNumber: ['', [Validators.required, Validators.pattern('[- +()0-9]{6,}') ]],
  email: ['', [Validators.required]],
  password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
  confirmPassword: ['', [Validators.required]],
  address2: [''],
  address: ['', [Validators.required]],
  zip: ['', [Validators.required]],
  country: [null, [Validators.required]],
  state: [null, [Validators.required]],
  billingAddress: ['']
}, {
  validator: MustMatch('password', 'confirmPassword')
        }
    );

  }
  get f(){
    return this.signUpForm.controls;
  }

  onSubmit(){
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;

    const name = this.signUpForm.get('name').value;
    const surname = this.signUpForm.get('surname').value;
    const phoneNumber = this.signUpForm.get('phoneNumber').value;

    const address = this.signUpForm.get('address').value;
    const address2 = this.signUpForm.get('address2').value;

    const zip = this.signUpForm.get('zip').value;
    const country = <Country>this.signUpForm.get('country').value;
    const state = this.signUpForm.get('state').value;
    let billingAddress = address;
    if(this.hideBilling === false)
     billingAddress = this.signUpForm.get('billingAddress').value;
    //console.log('onSubmit CreateNewUser');
    this.productService.CreateNewUser(email, name, surname, phoneNumber, password,address, zip, country.name,state, address2, billingAddress).then(
      () => {
        //console.log('signup Ok ');
        this.router.navigate(['/products']);
        
      },
      (error: string) => {
        //console.log('signup NOk '+ error);
        this.errorMessage = error
      }
    )
   
  }

}
