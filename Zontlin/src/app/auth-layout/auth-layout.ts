import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayout implements OnInit {
  message : String = "";
  
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getMessage();
  }

  getMessage():void {
    this.dataService.getData().subscribe(response => {
      this.message = `${response.message}`;
    });
  }
}
