import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FileUpload } from 'src/app/helpers/file-upload';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  productForm: any;

  actualUser: User = new User();
  userSubscription = new Subscription;

  constructor(private formBuilder: FormBuilder,
    private router: Router, private productSevice: ProductsService, private uploadService: FileUploadService) { }

  ngOnInit() {
    this.initForm();
    this.userSubscription = this.productSevice.userSubject.subscribe(
      (u: User) => {
       // console.log('u id '+u.userId+ ' Name'+ u.name);
        this.actualUser = u;
        this.productSevice.emitUser();
      });
      this.actualUser = this.productSevice.actualUser;
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


    // if (this.selectedFiles && this.selectedFiles.length > 0) {
    //   this.onUploadFile(this.selectedFiles.item(0))

    //   newProduct.photo = this.fileUrl;
    // }
    this.productSevice.createNewProduct(newProduct);
    this.router.navigate(['/products']);
  }

  //#region Upload
  // selectedFiles?: FileList;
  // currentFileUpload: FileUpload = new FileUpload(null);
  // percentage: number = 0;

  // selectFile(event: any): void {
  //   this.selectedFiles = event.target.files;
  // }

  // upload(): void {
  //   if(this.selectedFiles !== undefined){
  //     const file = this.selectedFiles.item(0);
  //     this.selectedFiles = undefined;
  
  //     this.currentFileUpload = new FileUpload(file);
  //     this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
  //       percentage => {
  //         if(percentage !== undefined)
  //                   this.percentage = Math.round(percentage);
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  //   }

  // }

  //#endregion

  // selectFile(event: any): void {
  //   this.selectedFiles = event.target.files;

  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     console.log('upload');
  //     if (file) {
  //       this.fileIsUploading = true;
  //       this.productService.uploadFile(file).then(
  //         (u: any) => {
  //           console.log('upload fileUrl '+u);
  //           this.fileUrl = u;
  //           this.fileIsUploading = false;
  //           this.fileUploaded = true;
  //          // this.fileInfos.
  //         }
  //       );
  //       // this.currentFile = file;

  //       // this.productService.uploadFile(this.currentFile);

  //     }
  //   }
    
  //   //console.log('selectFile '+   this.selectedFiles?.length );
  // }


  // upload(): void {
  //   this.progress = 0;

  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     console.log('upload');
  //     if (file) {
  //       this.fileIsUploading = true;
  //       this.productService.uploadFile(file).then(
  //         (u: any) => {
  //           console.log('upload fileUrl '+u);
  //           this.fileUrl = u;
  //           this.fileIsUploading = false;
  //           this.fileUploaded = true;
  //         }
  //       );
  //       // this.currentFile = file;

  //       // this.productService.uploadFile(this.currentFile);

  //     }
  //   }
  // }

  // onUploadFile(file: File | null) {
  //   //console.log('onUploadFile');
  //   if (file == null) return;
  //   this.fileIsUploading = true;
  //   this.productService.uploadFile(file).then(
  //     (u: any) => {
  //       this.fileUrl = u;
  //       this.fileIsUploading = false;
  //       this.fileUploaded = true;
  //     }
  //   );

  // }



  // selectedFiles?: FileList;
  // currentFile?: File;
  // progress = 0;
  // message = '';

  // fileInfos?: Observable<any>;





}
