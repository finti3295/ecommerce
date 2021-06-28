import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-list/product-form/product-form.component';
import { SingleProductComponent } from './product-list/single-product/single-product.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './services/auth.service'
import { AuthGuardService } from './services/auth-guard.service'
import { ProductsService } from './services/products.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AdminProductsComponent } from './product-list/admin-products/admin-products.component';
import { FileUploadService } from './services/upload-service.service';
import { AngularFireModule } from '@angular/fire';

const appRoutes: Routes = [
  {path: 'auth/signup', component: SignupComponent},
  {path: 'auth/signin', component: SigninComponent},
  {path: 'products',  component: ProductListComponent},
  {path: 'product/new', canActivate: [AuthGuardService],component: ProductFormComponent},
  {path: 'product/new:p', canActivate: [AuthGuardService],component: ProductFormComponent},
  {path: 'product/admin/products', component: AdminProductsComponent},
  {path: 'product/view/:id', canActivate: [AuthGuardService],component: SingleProductComponent},
  {path: '', redirectTo: 'products', pathMatch: 'full'},
  {path: '**', redirectTo: 'products'}
  ]
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductFormComponent,
    SingleProductComponent,
    SigninComponent,
    SignupComponent,
    HeaderComponent,
    AdminProductsComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyCgY-N3hLOCltQq30TQEhaLNyXF9dxXjwo",
      authDomain: "posts-a6997.firebaseapp.com",
      databaseURL: "https://posts-a6997-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "posts-a6997",
      storageBucket: "posts-a6997.appspot.com",
      messagingSenderId: "601468590038",
      appId: "1:601468590038:web:bc18d2d1ff5980f6873677",
      measurementId: "G-NK3FJXK5D9"
    }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthService,
    AuthGuardService,
    ProductsService,
    FileUploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
