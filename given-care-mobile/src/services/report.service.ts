import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable()
export class ReportService {

  constructor(private back: BackendService) {}

  send(data) {
    return this.back.postAuthenticated('/reports', data);
  }

  me() {
    return this.back.getAuthenticated('/users/me');
  }


}
