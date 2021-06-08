import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import firebase from 'firebase/app';
import { User } from '../models/user.model';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  isAuth: boolean = false;
  AuthSubject = new Subject<boolean>();

  constructor(private router: Router) {
  
   }
   canActivate() : Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().onAuthStateChanged(
          (user) => {
            if(user){
              resolve(true);
            }else{
              this.router.navigate(['/auth', 'signin']);
              resolve(false);
            }
          }
        )
        })
  }

  ngOnInit() {

  }
}
