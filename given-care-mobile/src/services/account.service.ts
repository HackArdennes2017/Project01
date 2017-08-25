import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable()
export class AccountService {

  constructor(private back: BackendService) {}

  getAccount() {
    return this.back.getAuthenticated('/accounts/');
  }


}
