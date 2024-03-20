import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode: boolean = false;
  pageNumber:number = 1;
  pageSize:number = 5;
  totalElements: number = 0;
  
  previousKeyword:string="";

  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchListProducts()
    } else {
      this.handleListProducts();
    }
    
  }
  handleSearchListProducts() {
     const searchKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

     if (this.previousKeyword !=searchKeyword){
           this.pageNumber = 1;
     }
     this.previousKeyword = searchKeyword;
     console.log(`ketword = ${searchKeyword} pagenumber = ${this.pageNumber}`)

      this.productService.searchProductsPaginate(this.pageNumber-1,
        this.pageSize ,searchKeyword).subscribe(this.processResult())
  }

    handleListProducts() {
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
      if (hasCategoryId) {
        // get the "id" param string. convert string to a number using the "+" symbol
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

        // get the "name" param string
        this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      } else {
        this.currentCategoryId = 1
        this.currentCategoryName = 'Books';
      }

      if (this.previousCategoryId != this.currentCategoryId){
        this.pageNumber = 1;
      }

      this.previousCategoryId = this.currentCategoryId;
      console.log('currentCategoryId=${this.currentCategoryId} , pagenumber=${this.pageNumber}');
      

      this.productService.getProductListPaginate(
        this.pageNumber - 1,
        this.pageSize,
        this.currentCategoryId
      ).subscribe(this.processResult());
    }

    updatePageSize(newValue:string) {
      this.pageSize = +newValue;
      this.pageNumber = 1;
      this.listProducts();
    }


    processResult(){
    return (data:any) => {
        this.products = data._embedded.products;
        this.pageNumber - data.page.number+1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements;
      }
    }
}
