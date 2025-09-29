// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`);
  }

  postItem(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, item);
  }
}