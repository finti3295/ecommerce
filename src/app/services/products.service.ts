
import { Observable, Subject, Subscription } from 'rxjs';
import { Product } from '../models/product.model';
import firebase from 'firebase';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productPath = '/products'; 


  products: Product[] = [];
  productSubject = new Subject<Product[]>();


  constructor(public firestore: AngularFirestore,  public afAuth: AngularFireAuth) {
   
  }


//#endregion


emitProducts() {
    this.productSubject.next(this.products);
  }

  saveProducts() {
    firebase.database().ref('/products').set(this.products);
  }

  getProducts() {
    console.log('getproducts before');
    var p = this.firestore.collection(this.productPath).
                          snapshotChanges();
    return p;
    // console.log('getproducts before'+  this.products.length);
    // firebase.database().ref('/products').on('value',
    //   (data) => {
    //     this.products = data.val() ? data.val() : [];
    //     this.emitProducts();
    //     console.log('getproducts after'+  this.products.length);
    //   }
    // )

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



  createNewProduct(newProduct: Product) {
    return new Promise<any>((resolve,reject)=>{

      this.firestore.collection(this.productPath).add(newProduct).then(res=>{resolve(true)},err=>reject(err));
      
      });
  }

  updateProduct(data: Product){

    return this.firestore.collection(this.productPath).doc(data.id).set({ completed:true},{ merge:true});
    
    }

  deleteProduct(data: Product){

    return this.firestore.collection (this.productPath)
    
    .doc(data.id)
    
    .delete();
    
    }

  removeProduct(post: Product) {
    if (post.photo) {

      // const storageRef = firebase.storage().refFromURL(post.photo);
      // storageRef.delete().then(
      //   () => {
      //     console.log("Photo supprimée !");
      //   }
      // ).catch(
      //   (error) => {
      //     console.log('Fichier non trouvé: ' + error);
      //   }
      // )
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

}
