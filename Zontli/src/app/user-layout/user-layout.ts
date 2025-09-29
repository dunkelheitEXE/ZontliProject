import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css'
})
<<<<<<< HEAD:Zontlin/src/app/auth-layout/auth-layout.ts
export class AuthLayout implements OnInit {
  message : String = "";
  
  constructor(private dataService: DataService) {}
=======
export class UserLayout {
>>>>>>> 3ae973a1b7adab2c8ccf924e47e4b7e7b56d5242:Zontli/src/app/user-layout/user-layout.ts

  ngOnInit(): void {
    this.getMessage();
  }

  getMessage():void {
    this.dataService.getData().subscribe(response => {
      this.message = `${response.message}`;
    });
  }
}
