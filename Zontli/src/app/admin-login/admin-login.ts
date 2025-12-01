import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminAuthService } from '../services/admin/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {

  constructor(private authService: AdminAuthService) {}

  onSubmit(loginForm: any) {
    let data = loginForm.value;
    console.log(data.email);
    console.log(data.password);

    this.authService.login(data.email, data.password).subscribe({
      next: (res) => {
        if(!res.success) {
          console.log(res);
        }
      },
      error: (er) => {
        console.log("Internal server error");
        console.log(er);
        if(er.status >= 400 && er.status < 500) {
          alert("Credentials are wrong, please check it");
        } else if (er.status >= 500 && er.status < 600) {
          alert("Internal server Error, Please, come later and problem will be solved");
        }
      }
    });
  }
}
