import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products'

  private categoryUrl = 'http://localhost:8080/api/product-category'
   
  constructor(private httpClient: HttpClient) { }

  searchProducts(searchword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${searchword}`;
    return this.getProducts(searchUrl)
  }

  searchProductsPaginate(page :number, pageSize: number, searchword: string): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${searchword}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductListPaginate(page :number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl)
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductsCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl)
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size:number,
    totalElements:number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductsCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
