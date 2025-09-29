import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  onSubmit(formValue: any) : void {
    console.log(formValue["form"].value);
  }
}
