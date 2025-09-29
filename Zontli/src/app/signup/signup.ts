import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  form = {
    fullName: "",
    date: "",
    nacionality: "",
    gender: "",
    id: "",
    rfc: "",
    address: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
    password: "",
    confiPass: "",
  }

  constructor (private apiService : ApiService) {}

  onSubmit(formValue: any) : void {
    this.apiService.signup(formValue["form"].value).subscribe(response => console.log(response.message));
  }
}
