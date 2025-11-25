import { Component } from '@angular/core';
import { AdminAuthService } from '../../services/admin/admin-auth.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  accounts = null;

  constructor(private authService: AdminAuthService, private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAllAccounts().subscribe({
      next: (results) => {
        if(!results.success) {
          alert("Something in server has gone wrong");
        } else {
          this.accounts = results.data[0];
          console.log(this.accounts);
        }
      },
      error: (erno) => {
        console.log("Internal server error")
        console.log(erno);
      }
    });
  }

  updateAccount(id: number) {
    
  }

  logout () {
    this.authService.logout();
  }
}
