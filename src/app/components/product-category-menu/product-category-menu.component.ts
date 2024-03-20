import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.listProductCategoties();
  }
  listProductCategoties() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('ProductCategories = ' + JSON.stringify(data));
        this.productCategories = data;
      })
  }

}
