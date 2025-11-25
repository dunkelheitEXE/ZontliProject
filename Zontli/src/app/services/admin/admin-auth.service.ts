// admin-auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface Admin {
  admin_id: number;
  email: string;
  name?: string;
  role: string;
}

interface AdminLoginResponse {
  success: boolean;
  message: string;
  admin: Admin;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentAdminSubject = new BehaviorSubject<Admin | null>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check for existing admin token on service initialization
    const token = localStorage.getItem('adminAuthToken');
    const admin = localStorage.getItem('currentAdmin');
    if (token && admin) {
      this.currentAdminSubject.next(JSON.parse(admin));
    }
  }

  login(email: string, password: string): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/login-admin`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            // Store token and admin in localStorage
            localStorage.setItem('adminAuthToken', response.token);
            localStorage.setItem('currentAdmin', JSON.stringify(response.admin));
            this.currentAdminSubject.next(response.admin);

            // Redirect to admin dashboard
            this.router.navigate(['/admin']);
          }
        })
      );
  }

  logout(): void {
    // Remove tokens and admin data
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('currentAdmin');
    this.currentAdminSubject.next(null);

    // Redirect to admin login page
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('adminAuthToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentAdmin(): Admin | null {
    return this.currentAdminSubject.value;
  }

  // Verify if current user is admin (checks role in stored data)
  isAdmin(): boolean {
    const admin = this.getCurrentAdmin();
    return admin !== null && admin.role === 'admin';
  }
}
