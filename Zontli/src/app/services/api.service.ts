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

  addAcount(userId: any, type: any, balance: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addAccount`, [userId, type, balance]);
  }

  transfer(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, [formData]);
  }

  email(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/testemail`, item);
  }

  getAccounts(userId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/accounts/${userId}`);
  }
}