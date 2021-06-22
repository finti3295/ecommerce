import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  actualUser: any; // Save logged in user data
  userSubject = new Subject<User>();
  constructor( public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router , public ngZone: NgZone // NgZone service to remove outside scope warning
     ) {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.actualUser = user;
          localStorage.setItem('user', JSON.stringify(this.actualUser));
          var u = localStorage.getItem('user')
          if (u !== null && u !== "")
                    JSON.parse(u);
        } else {
          localStorage.setItem('user', "");
          var u = localStorage.getItem('user')
          if (u !== null && u !== "")
                    JSON.parse(u);
        }
      })
     }

     isAuth: boolean = false;
     AuthSubject = new Subject<boolean>();

     EmitAuth() {
      console.log('EmitAuth '+this.isAuth);
      this.AuthSubject.next(this.isAuth);
      this.emitUser()
    }
  
  
    emitUser() {
      this.userSubject.next(this.actualUser);
    }

     SignInUser(email:string, password:string){
      return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log("SignInUser ok "+result.user?.uid)
        this.ngZone.run(() => {
          this.router.navigate(['products']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        console.log(error.message)
      })
      
    }


  CreateNewUser(email: string, name: string, surname: string, phoneNumber: string, password: string,
    address: string, zip: string, country: string,city: string, address2: string , billingAddress:string ){
      var u = new User(email, name, surname, phoneNumber,address, zip, country,city, address2, billingAddress);
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then((registeredUser) => {

      if(registeredUser && registeredUser.user ){
        u.userId = registeredUser.user.uid;
        this.SetUserData(u);
      
      }else{
        console.log("Authentication error");
        this.isAuth = false;
        this.actualUser = new User();
        this.SetUserData(registeredUser.user);
        this.EmitAuth();
      }


      /* Call the SendVerificaitonMail() function when new user sign 
      up and returns promise */
     // this.SendVerificationMail();

    }).catch((error) => {
      window.alert(error.message)
    })

  }

  // Sign out 
SignOut() {
  return this.afAuth.signOut().then(() => {
    localStorage.removeItem('user');
    this.router.navigate(['sign-in']);
  })
}

  /* Setting up user data when sign in with username/password, 
sign up with username/password and sign in with social auth  
provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
SetUserData(user: any) {
   console.log("SetUserData email "+ JSON.stringify(user))
  // console.log("SetUserData uid "+user.uid)
  // console.log("SetUserData name "+user.name)
  // console.log("SetUserData surname "+user.surname)
  // console.log("SetUserData phoneNumber "+user.phoneNumber)
  // console.log("SetUserData "+user.email)
  // console.log("SetUserData "+user.email)
  // console.log("SetUserData "+user.email)
  // console.log("SetUserData "+user.email)
  // console.log("SetUserData "+user.email)
  // console.log("SetUserData "+user.email)
  // console.log("SetUserData "+user.email)
  // console.log("SetUserData "+user.email)
  const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
  const userData: User = {
    userId: user.uid,
    email: user.email,
    name: user.name,
    surname: user.surname,
    phoneNumber: user.phoneNumber,

    address: user.address,
    zip: user.zip,
    country: user.country,
    state: user.state,
    address2: user.address2,

    billingAddress: user.billingAddress,
    cartProducts: user.cartProducts,
    orders: user.orders
  }
  // return this.afs.doc<User>(`users/${user.uid}`).set(userData, {
  //     merge: true
  //   })
  return userRef.set(userData, {
    merge: true
  })
}

  //  // Send email verfificaiton when new user sign up
  //  SendVerificationMail() {
  //   return this.afAuth.send. sendEmailVerification()
  //   .then(() => {
  //     this.router.navigate(['verify-email-address']);
  //   })
  // }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    var b = localStorage.getItem('user');
    if(b !== null && b!== "")
 {
  const user = JSON.parse(b);
  return (user !== null && user.emailVerified !== false) ? true : false;
 }
 return false;
  }



// Sign in with Google
// GoogleAuth() {
//   return this.AuthLogin(new auth. GoogleAuthProvider());
// }

// Auth logic to run auth providers
// AuthLogin(provider) {
//   return this.afAuth.auth.signInWithPopup(provider)
//   .then((result) => {
//      this.ngZone.run(() => {
//         this.router.navigate(['dashboard']);
//       })
//     this.SetUserData(result.user);
//   }).catch((error) => {
//     window.alert(error)
//   })
// }




}
