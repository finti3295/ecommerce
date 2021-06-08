import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  productForm: any;
  fileIsUploading = false;
  fileUrl: string = "";
  fileUploaded = false;

  actualUser: User = new User("", "", "", "","","","","","");
  userSubscription = new Subscription;

  constructor(private formBuilder: FormBuilder,
    private productService: ProductsService,
    private router: Router, private productSevice: ProductsService) { }

  ngOnInit() {
    this.initForm();
    this.userSubscription = this.productSevice.userSubject.subscribe(
      (u: User) => {
       // console.log('u id '+u.userId+ ' Name'+ u.name);
        this.actualUser = u;
        this.productService.emitUser();
      });
      this.actualUser = this.productService.actualUser;
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
    //console.log('title '+title);
    const content = this.productForm.get('content').value;
   // console.log('content '+content);
    const price = this.productForm.get('price').value;
    //console.log('price '+price);
    //console.log('this.actualUser name '+this.actualUser.name);
    //console.log('this.actualUser id '+this.actualUser.userId);
    console.log('file url '+this.fileUrl);
    const newProduct = new Product(title, content, price, this.actualUser.userId);
     //console.log("url ",newProduct);
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.onUploadFile(this.selectedFiles.item(0))

      newProduct.photo = this.fileUrl;
    }
    this.productService.createNewProduct(newProduct);
    this.router.navigate(['/products']);
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    
    //console.log('selectFile '+   this.selectedFiles?.length );
  }


  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.productService.uploadFile(this.currentFile);

      }
    }
  }

  onUploadFile(file: File | null) {
    //console.log('onUploadFile');
    if (file == null) return;
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





}
