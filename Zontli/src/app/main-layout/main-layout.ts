import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  userIconName: String = "";
  constructor (private authService: AuthService) {
    const gettingUser = localStorage.getItem("currentUser") ?? "";
    const userr = JSON.parse(gettingUser);
    this.userIconName = userr["name"] ?? "";
  }
  onLogout() : void {
    this.authService.logout();
  }
}
