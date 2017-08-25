import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable()
export class ProductService {

  constructor(private back: BackendService) {}

  getProducts() {
    return this.back.getUnauthenticated('/products/');
  }

  pay(productId, tipAmount) {
    return this.back.postAuthenticated(`/products/${productId}/pay`, {
      tip: tipAmount
    });
  }


}
