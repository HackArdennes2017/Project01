import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class BackendService {

  baseUrl = '';

  constructor(private http: Http) {
    //this.baseUrl = 'http://172.16.24.84:5000';
    this.baseUrl = 'http://172.16.24.70:5000';
  }

  getAuthenticated(uri) {
    return this.http.get(`${this.baseUrl}${uri}`, {
      headers: new Headers({
        'Authorization': 'Bearer xxx'
      })
    });
  }

  getUnauthenticated(uri) {
    return this.http.get(`${this.baseUrl}${uri}`);
  }

  postUnauthenticated(uri, data) {
    return this.http.post(`${this.baseUrl}${uri}`, data, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  postAuthenticated(uri, data) {
    return this.http.post(`${this.baseUrl}${uri}`, data, {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      })
    });
  }
  

}
