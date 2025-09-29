import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  form = {
    email : "",
    password : ""
  }

  constructor(private apiService : ApiService) {}

  onSubmit() {
    alert("HA");
    this.apiService.signup(this.form).subscribe(e=>{
      console.log(e.message);
    });
  }
}
