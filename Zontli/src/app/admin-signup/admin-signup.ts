import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-admin-signup',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-signup.html',
  styleUrl: './admin-signup.css'
})
export class AdminSignup {

  constructor(private apiService: ApiService) {}

  onSubmit(adminForm: any) {
    this.apiService.createAdminAccount(adminForm.value).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
