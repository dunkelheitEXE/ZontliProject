import { Component } from '@angular/core';
import { AdminAuthService } from '../../services/admin/admin-auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  constructor(private authService: AdminAuthService) {}

  logout () {
    this.authService.logout();
  }
}
