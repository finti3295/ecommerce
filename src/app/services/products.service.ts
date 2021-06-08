
import { Observable, Subject } from 'rxjs';
import { Product } from '../models/product.model';
import firebase from 'firebase';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products: Product[] = [];
  productSubject = new Subject<Product[]>();

  actualUser: User = new User();
  userSubject = new Subject<User>();

  isAuth: boolean = false;
  AuthSubject = new Subject<boolean>();

  constructor() {
    

  }

  emitUser() {
    this.userSubject.next(this.actualUser);
  }

  EmitAuth() {
    //console.log('EmitAuth '+this.isAuth);
    this.AuthSubject.next(this.isAuth);
   this.emitUser();
  }




  CreateNewUser(email: string, name: string, surname: string, phoneNumber: string, password: string,
    address: string, zip: string, country: string,city: string, address2: string , billingAddress:string ) {
    var u = new User(email, name, surname, phoneNumber,address, zip, country,city, address2, billingAddress);

    return new Promise(
      ( resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          (registeredUser) => {
            if(registeredUser && registeredUser.user ){
              u.userId = registeredUser.user.uid;
              firebase.database().ref("users").child(u.userId).set(u).then(
                (m) => {
              
                  this.actualUser = u;               
                  this.isAuth = true;
                  this.emitUser();
                  resolve(registeredUser);
                  //console.log('Ok '+m);
                },
                (error1) => {         
                  this.isAuth = false;
                  this.emitUser();
                  reject(error1);
                  //console.log('NOk '+error);
             
                }
              )
            }else{
              reject("Authentication error");
            }
           
          },
          (error) => {
            reject(error);
          }
        )
      }
    );



    // //console.log('CreateNewUser '+u);
    // return new Promise(
    //   (resolve, reject) => {
    //     firebase.database().ref("users").child(u.userId).set(u).then(
    //       (m) => {
    //         this.actualUser = u;
    //         this.emitUser();
    //         this.isAuth = true;
    //         this.EmitAuth();
    //         resolve(true);
    //         //console.log('Ok '+m);
    //       },
    //       (error) => {
    //         reject(error);
    //         this.isAuth = false;
    //         this.EmitAuth();
    //         //console.log('NOk '+error);
    //         reject();
    //       }
    //     )
    //   }
    // )
  }


  SignInUser(email:string, password:string){
    return new Promise(
      (resolve, reject) =>{
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          (m) => {
            //console.log('signInWithEmailAndPassword Ok '+ m);
            firebase.database().ref('/users/' + m.user?.uid).once('value').then(
              (data) => {
                this.actualUser = data.val();
              
                  console.log('SignInUser Ok '+  this.actualUser.name);
                  this.isAuth = true;
                  this.emitUser()
                  //this.EmitAuth();
                  resolve(m);                
          
              }, (error) => {
                this.isAuth = false;
                this.EmitAuth();
                reject(error);
              }
            )


          },
          (error) => {
            reject(error);
          }
        )
      }
    )
    // return new Promise(
    //   (resolve, reject) => {
    //     firebase.database().ref('/users/' + User.decode(email)).once('value').then(
    //       (data) => {
    //         this.actualUser = data.val();
    //         if(this.actualUser.password != password){
    //           reject("Password wrong");
    //         }else{
    //           console.log('SignInUser Ok '+  this.actualUser.name);
    //           this.isAuth = true;
    //           //this.emitUser()
    //           this.EmitAuth();
    //           resolve(data.val());
    //         }
      
    //       }, (error) => {
    //         this.isAuth = false;
    //         this.EmitAuth();
    //         reject(error);
    //       }
    //     )

    //   }
    // )
  }

  SignOutUser() {
    firebase.auth().signOut();
  }




  emitProducts() {
    this.productSubject.next(this.products);
  }

  saveProducts() {
    firebase.database().ref('/products').set(this.products);
  }

  getProducts() {
    console.log('getproducts before'+  this.products.length);
    firebase.database().ref('/products').on('value',
      (data) => {
        this.products = data.val() ? data.val() : [];
        this.emitProducts();
        console.log('getproducts after'+  this.products.length);
      }
    )

  }

  getSingleProduct(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/products/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        )

      }
    )
  }

  addLike(p: Product) {
    p.loveIts++;
    this.saveProducts();
    this.emitProducts();
  }

  removeLike(p: Product) {
    p.loveIts--;
    this.saveProducts();
    this.emitProducts();
  }

  createNewProduct(newProduct: Product) {
    console.log(newProduct);
    this.products.push(newProduct);
    //console.log(this.posts);
    this.saveProducts();
    this.emitProducts();
  }

  removeProduct(post: Product) {
    if (post.photo) {

      const storageRef = firebase.storage().refFromURL(post.photo);
      storageRef.delete().then(
        () => {
          console.log("Photo supprimée !");
        }
      ).catch(
        (error) => {
          console.log('Fichier non trouvé: ' + error);
        }
      )
    }
    const productIndexToRemove = this.products.findIndex(
      (prodEl) => {
        if (prodEl === post) {
          return true;
        }
        return false;
      }
    );

    this.products.splice(productIndexToRemove, 1);//remove the product locally

    this.saveProducts();

    this.emitProducts();
  }




  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        // console.log('UploadFile' + almostUniqueFileName +file.name);
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name)
          .put(file);
        // console.log('2');
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                console.log(' User doesn\'t have permission to access the object');
                break;
              case 'storage/canceled':
                console.log('User canceled the upload');
                break;

              // ...

              case 'storage/unknown':
                console.log(' Unknown error occurred, inspect error.serverResponse');
                break;
            }
            reject();
          },
          () => {
            // console.log('4');
            upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            });
            //resolve(upload.snapshot.downloadURL);

          }
        )
      }
    )
  }





}
