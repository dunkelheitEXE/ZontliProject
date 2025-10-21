import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form = {
    'email': "",
    'password': ""
  };

  constructor (private apiService: ApiService, private authService: AuthService) {}

  onSubmit(formData: any): void {
    console.log(formData["form"].value);
    let data = formData["form"].value;
    // this.apiService.login(data).subscribe(res => console.log(res.message));
    this.authService.login(data["email"], data["password"]).subscribe({
      next: (res) => {
        console.log(res.message);
        // Manejar éxito
      },
      error: (error) => {
        alert('Error: ' + (error.error?.message || 'Login failed'));
        console.error(error);
      }
    });
  }
}
