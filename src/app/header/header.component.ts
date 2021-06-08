import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

actualUser: User = new User("","","","","","","","","");
userSubscription = new Subscription;

 isAuth: boolean = false;
authSubscription = new Subscription;
  constructor(private productSevice: ProductsService) { }

  ngOnInit() {
   // console.log("Authenticated "+this.isAuth);
   this.isAuth = this.productSevice.isAuth
  

    this.userSubscription = this.productSevice.userSubject.subscribe(
      (u: User) => {
        this.actualUser = u;

      }
      
    )
  }

  onSignOut(){
    this.productSevice.SignOutUser();
  }

}