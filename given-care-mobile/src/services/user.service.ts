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

  register(email, password) {
    return this.back.postUnauthenticated('/users', {
      email,
      password
    });
  }

  me() {
    return this.back.getAuthenticated('/users/me');
  }

  getRate(projectId) {
    return this.back.getAuthenticated('/users/me/projects/' + projectId + '/rate');
  }

  setRate(projectId, rate, isNew) {
    return this.back.putAuthenticated('/users/me/projects/' + projectId + '/rate', {
      rate,
      isNew
    });
  }


}
