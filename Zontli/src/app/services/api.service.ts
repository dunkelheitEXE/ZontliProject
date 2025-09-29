// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust port if needed
  
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`);
  }

  signup(newUser: any) : Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, newUser);
  }

  login(user: any) : Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  createItem(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, item);
  }
}