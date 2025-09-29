import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{
  constructor (private apiService: ApiService) {}

  ngOnInit(): void {
      this.fetch();
  }

  fetch() : void {
    this.apiService.getData().subscribe(res => {
      console.log(res);
    });
  }
}
