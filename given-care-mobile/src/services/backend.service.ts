import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { UserData } from '../providers/user-data/user-data';

@Injectable()
export class BackendService {

  baseUrl = '';

  constructor(private http: Http, private userData:UserData) {
    //this.baseUrl = 'http://172.16.24.70:5000'; // Mat
    this.baseUrl = 'https://team01.hackardennes.com/api'; // PROD
  }

  getAuthenticated(uri) {
    return new Promise((resolve, reject) => {
      this.userData.getJwtToken().then(token => {
        this.http.get(`${this.baseUrl}${uri}`, {
          headers: new Headers({
            'Authorization': token
          })}).subscribe(
            response => {
              this.userData.setJwtToken(response.headers.get('authorization'));
              resolve(response)
            },
            err => reject(err)
          );
      });
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
    return new Promise((resolve, reject) => {
      this.userData.getJwtToken().then(token => {
        this.http.post(`${this.baseUrl}${uri}`, data, {
          headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
          })}).subscribe(
            response => {
              this.userData.setJwtToken(response.headers.get('authorization'));
              resolve(response)
            },
            err => reject(err)
          );
      });
    });
  }

  putAuthenticated(uri, data) {
    return new Promise((resolve, reject) => {
      this.userData.getJwtToken().then(token => {
        this.http.put(`${this.baseUrl}${uri}`, data, {
          headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
          })}).subscribe(
            response => {
              this.userData.setJwtToken(response.headers.get('authorization'));
              resolve(response)
            },
            err => reject(err)
          );
      });
    });
  }


}
