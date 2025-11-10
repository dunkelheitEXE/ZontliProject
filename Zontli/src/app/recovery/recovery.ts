import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-recovery',
  imports: [FormsModule, CommonModule],
  templateUrl: './recovery.html',
  styleUrl: './recovery.css'
})
export class Recovery {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';

  constructor (private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    // Catch the token from URL query params
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  onSubmit(resetForm: any) {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    const password = resetForm.form.value.password;

    this.apiService.resetPassword(this.token, password).subscribe(res=>{
      console.log(res);
    })
  }
}
