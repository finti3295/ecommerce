import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  productSubscription = new Subscription;
  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
    this.productSubscription = this.productService.productSubject.subscribe(
      (p: Product[]) => {
        this.products = p;
      })
      //this.products = this.productService.products;
      this.productService.getProducts();
      // console.log('scv admin products '+  this.productService.products.length);
      // console.log('admin products '+  this.products.length);
  }

}
