import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  productSubscription = new Subscription;

  constructor(private productService: ProductsService, private router: Router) { }

  ngOnInit(): void {
    this.productSubscription = this.productService.productSubject.subscribe(
      (p: Product[]) => {
        this.products = p;
      }
    )
    //console.log('ngOnInit product-list'+  this.products.length);
    this.productService.getProducts();
    //console.log('ngOnInit product-list after'+  this.products.length);

  }

}
