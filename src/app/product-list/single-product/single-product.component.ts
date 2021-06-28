import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {

  productForm: any ;
  fileIsUploading = false;
  fileUrl: string = "";
  fileUploaded= false;

  actualUser: User = new User("","","","","","","","","");
  userSubscription = new Subscription;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductsService,
              private router: Router, private productSevice: ProductsService) { }

  ngOnInit() {
    this.initForm();
    this.userSubscription = this.productSevice.userSubject.subscribe(
      (u: User) => {
        this.actualUser = u;
      });
  }

  initForm(){
    this.productForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  onSaveProduct(){
    const title = this.productForm.get('title').value;
    //console.log('title '+title);
    const content = this.productForm.get('content').value;
    const price = this.productForm.get('price').value;
    const newProduct = new Product(title, content, price, this.actualUser.userId);
   // console.log("url ",this.fileUrl);
    if(this.fileUrl && this.fileUrl !== ''){
      console.log(this.fileUrl);
      //newProduct.photo = this.fileUrl;
    }
    this.productService.createNewProduct(newProduct);
    this.router.navigate(['/products']);
  }

  onUploadFile(file: File| null){
    //console.log('onUploadFile');
    if(file == null)return;
    this.fileIsUploading = true;
    this.productService.uploadFile(file).then(
      (u: any) => {
          this.fileUrl = u;
            this.fileIsUploading = false;
              this.fileUploaded = true;
            }
    );

  }














  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;
  
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
  
      if (file) {
        this.currentFile = file;
  
        this.productService.uploadFile(this.currentFile);
   
  }}






}}
