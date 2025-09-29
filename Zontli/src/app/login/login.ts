import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor (private apiService: ApiService) {}

  onSubmit(formData: any): void {
    console.log(formData["form"].value);
    let data = formData["form"].value;
    this.apiService.login(data).subscribe(res => console.log(res.message));
  }
}
