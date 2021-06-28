
import { Observable, Subject } from 'rxjs';
import { Product } from '../models/product.model';
import firebase from 'firebase';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
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
  productsRef: string = "/products"
   basePath = '/uploads';

  constructor(private db: AngularFireDatabase, public storage: AngularFireStorage) {
    

  }


  EmitAuth() {
    //console.log('EmitAuth '+this.isAuth);
    this.AuthSubject.next(this.isAuth);
   this.userSubject.next(this.actualUser);
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
                  this.EmitAuth();
                  resolve(registeredUser);
                  console.log('CreateNewUser Ok '+m);
                },
                (error1) => {         
                  this.isAuth = false;
                  this.EmitAuth();
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
                  this.EmitAuth();
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
   
  }

  SignOutUser() {
    firebase.auth().signOut();
    console.log('  firebase.auth().signOut() '+  this.isAuth);
  }




  emitProducts() {
    this.productSubject.next(this.products);
  }

  saveProducts() {
    firebase.database().ref(this.productsRef).set(this.products);
  }

  getProducts() {
    //console.log('getproducts before'+  this.products.length);
    firebase.database().ref(this.productsRef).on('value', (snap) => {
      this.products= [];
      snap.forEach((child) => {
        var myP =child.val() as Product;
        if(child.key)
                myP.productId = child.key;
              //  console.log('id'+  myP.productId);
        this.products.push(myP);
        // this.products.push({
        //   _key: child.key,
        //   ...child.val()
        // });
        //console.log('getproducts after'+  this.products.length);
        this.emitProducts();
      });
    
    });

    // firebase.database().ref('/products').on('value',
    //   (data) => {
    //     // console.log('data'+  data);
    //      console.log('data.val'+  data.val);
    //     // console.log('data.json'+  data.toJSON);
    //     this.products = data.val() ? data.val() : [];
    //     console.log('getproducts after'+  this.products.length);
    //     this.emitProducts();
    //     console.log('getproducts after'+  this.products.length);
    //   }
    // )

  }

  getSingleProduct(id: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref(this.productsRef).child(id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        )

      }
    )
    // return new Promise(
    //   (resolve, reject) => {
    //     firebase.database().ref(this.productsRef+'/' + id).once('value').then(
    //       (data) => {
    //         resolve(data.val());
    //       }, (error) => {
    //         reject(error);
    //       }
    //     )

    //   }
    // )
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
    console.log("before "+newProduct.productId);

    // this.products.push(newProduct);
    //  this.saveProducts();
    firebase.database().ref(this.productsRef).push().set(newProduct).then(
   
        (u) => {
          console.log("u "+ u);
          if(u && u.key)
          newProduct.productId = u.key
          console.log("after "+newProduct.productId);
          this.emitProducts();
        }     
    );

   //firebase.database().ref().child('products').set(newProduct);
   this.emitProducts();

   
  }

  removeProduct(post: Product) {
    if (post.photo) {
      post.photo.forEach(element => {
        this.deleteFile(element).then(
          () => {
            console.log("Photo supprimée !");
          }
        ).catch(
          (error) => {
            console.log('Fichier non trouvé: ' + error);
          }
        )
});
     
    
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
  }}

deleteFile(fileUrl: string){
  const storageRef = firebase.storage().refFromURL(fileUrl);
 return storageRef.delete();
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
