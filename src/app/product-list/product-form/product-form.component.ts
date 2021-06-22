import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductsService } from 'src/app/services/products.service';
import { map } from 'rxjs/operators';
import { FileUpload } from 'src/app/helpers/file-upload';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  productForm: any;

  actualUser: User = new User();
  userSubscription = new Subscription;

  fileUploads: any[] = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router, private productSevice: ProductsService, private authService: AuthService,
     private uploadService: FileUploadService) { }

  ngOnInit() {
    this.initForm();
    this.uploadService.getFiles(6).snapshotChanges().pipe(
      map(changes =>
        // store the key
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      this.fileUploads = fileUploads;
    });

    this.userSubscription = this.authService.userSubject.subscribe(
      (u: User) => {
       // console.log('u id '+u.userId+ ' Name'+ u.name);
        this.actualUser = u;
        this.authService.emitUser();
      });
      this.actualUser = this.authService.actualUser;
      //console.log('this.actualUser id '+this.actualUser.userId+ ' Name'+ this.actualUser.name);
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  onSaveProduct() {
    const title = this.productForm.get('title').value;

    const content = this.productForm.get('content').value;

    const price = this.productForm.get('price').value;

    const newProduct = new Product(title, content, price, this.actualUser.userId);

    if(this.fileUploads !== undefined)
        newProduct.photo = this.fileUploads.map(x => (<FileUpload>x).url)


    this.productSevice.createNewProduct(newProduct);
    this.router.navigate(['/products']);
  }


}
