import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-forgot',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot.html',
  styleUrl: './forgot.css'
})
export class Forgot {

  constructor (private apiService: ApiService) {

  }

  onSubmit(recoveryForm: any) {
    // console.log(recoveryForm.form.value);
    const data = recoveryForm.form.value;
    this.apiService.sendEmailToRecoverPassword(data).subscribe(res=>{
      console.log(data)
      console.log(res);
      alert("An email was sent to your inbox, check it to reset your password");
    });
  }
}
