import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable()
export class ReportService {

  constructor(private back: BackendService) {}

  send(type) {
    return this.back.postAuthenticated('/reports', {
      type,
      gps : {
        latitude : 347,
        longitude : 32
      }
    });
  }

  me() {
    return this.back.getAuthenticated('/users/me');
  }


}
