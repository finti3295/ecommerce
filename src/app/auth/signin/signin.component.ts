import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {


  signInForm  : any;
  errorMessage!: string; 

  constructor(private formBuilder: FormBuilder,
              private productService: ProductsService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.signInForm = this.formBuilder.group(
{
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
}
    );

  }

  onSubmit(){
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;
    console.log(' signin passwordr'+  password);
    this.productService.SignInUser(email, password).then(
      () => {
        this.router.navigate(['/products']);
      },
      (error:string) => {
        console.log(' signin error'+  error);
        this.errorMessage = error
      }
    )
  }

}
