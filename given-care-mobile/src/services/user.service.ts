import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable()
export class UserService {

  constructor(private back: BackendService) {}

  login(email, password) {
    return this.back.postUnauthenticated('/users/login/basic', {
      email,
      password
    });
  }
  

}
