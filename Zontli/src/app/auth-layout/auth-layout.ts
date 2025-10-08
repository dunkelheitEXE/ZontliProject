import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayout implements OnInit{
  message : String = "";
  constructor (private apiService : ApiService) {}

  ngOnInit(): void {
      this.fetch();
  }

  fetch() : void {
    this.apiService.getData().subscribe(e=>{
      this.message = e.message;
    })
  }
}
