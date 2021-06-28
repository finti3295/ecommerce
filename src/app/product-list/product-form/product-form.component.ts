import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FileUpload } from 'src/app/models/file-upload.model';
import { loadedFile } from 'src/app/models/loadedfile.model';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { ProductsService } from 'src/app/services/products.service';
import { FileUploadService } from 'src/app/services/upload-service.service';
import { finalize } from 'rxjs/operators';

import firebase from 'firebase';

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
  title: string = "";
  newProduct: any;
  @Input() id: string = "";

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  actualUser: User = new User("", "", "", "", "", "", "", "", "");
  userSubscription = new Subscription;

  constructor(private formBuilder: FormBuilder,
    private productService: ProductsService,
    private router: Router, private productSevice: ProductsService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log("params " + JSON.stringify(params, null, 2));
      this.id = params['id'];
      console.log("id " + this.id);
      if(this.id)
      this.productService.getSingleProduct(this.id).then(
        (p) => {
          this.newProduct = p;
          // console.log("this.newProduct  " + this.newProduct );
        }
      );
    });
  }

  ngOnInit() {
    this.initForm();
    this.userSubscription = this.productSevice.userSubject.subscribe(
      (u: User) => {

        this.actualUser = u;
        this.productService.EmitAuth();
      });
    this.actualUser = this.productService.actualUser;
    console.log('this.newProduct ' + this.newProduct.title);

    //console.log('this.actualUser id '+this.actualUser.userId+ ' Name'+ this.actualUser.name);
  }

  initForm() {
    if (this.newProduct === undefined) {
      this.title = "Add product";
      this.newProduct = new Product("", "", 0, "")
    } else
      this.title = "Edit product"

    this.productForm = this.formBuilder.group({
      title: [this.newProduct.title, Validators.required],
      content: [this.newProduct.content, Validators.required],
      price: [this.newProduct.price, Validators.required]
    })
  }

  onSaveProduct() {
    const title = this.productForm.get('title').value;
    //console.log('title '+title);
    const content = this.productForm.get('content').value;

    const price = this.productForm.get('price').value;

    this.newProduct = new Product(title, content, price, this.actualUser.userId);
    if (this.fileInfos) {

      //var l =  this.fileInfos.map(x => x.url);
      this.newProduct.photo = this.fileInfos.map(x => x.url);
      console.log('photo ' + this.newProduct.photo);
    }
    this.productService.createNewProduct(this.newProduct);
    this.router.navigate(['/products']);
  }

 

  fileInfos: FileUpload[] = [];
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;

    //console.log('selectFile '+   this.selectedFiles?.length );
  }

  delete(f: FileUpload): void {
    this.progress = 0;
    this.productService.deleteFile(f.url).then(
      () => {
        const index = this.fileInfos.indexOf(f);
        if (index > -1) {
          this.fileInfos.splice(index, 1);
        }
        console.log("fileUrl supprimée !" + f.url);
      }
    ).catch(
      (error) => {
        console.log('FifileUrl  non trouvé: ' + error);
      }
    )
  }



  uploadFile(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file = this.selectedFiles.item(0);
      if (file) {
        var fileUpload = new FileUpload(file);

        const filePath = `${this.productService.basePath}/${fileUpload.file.name}`;
        const storageRef = this.productService.storage.ref(filePath);
        const uploadTask = this.productService.storage.upload(filePath, fileUpload.file);
    
        uploadTask.snapshotChanges().pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe(downloadURL => {
              fileUpload.url = downloadURL;
              fileUpload.name = fileUpload.file.name;
              this.fileInfos.push(fileUpload)
              this.fileIsUploading = false;
              
             // this.saveFileData(fileUpload);
            });
          })
        ).subscribe();
        this.fileIsUploading = true;
        uploadTask.percentageChanges().subscribe(
      percentage => {
        console.log('percentage: ' + percentage);
        if(percentage)
                this.progress = Math.round(percentage);
      },
      error => {
        console.log(error);
      }
    );
  }
}
  }

  // upload(): void {
  //   this.progress = 0;

  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);

  //     if (file) {
  //       this.currentFile = file;

  //       this.productService.uploadFile(this.currentFile).then(
  //         (u: any) => {
  //           var f = new loadedFile(u, file.name);
  //           this.fileUrl = u;
  //           this.fileIsUploading = false;
  //           this.fileUploaded = true;
  //           this.fileInfos.push(f)
  //           console.log('upload fileUrl ' + f.url);
  //         }
  //       );

  //     }
  //   }
  // }
}
