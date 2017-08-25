import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable()
export class ProjectService {

  constructor(private back: BackendService) {}

  getAll() {
    return this.back.getAuthenticated('/projects');
  }

}
