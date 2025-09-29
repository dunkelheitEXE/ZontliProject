import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-main-layout',
  imports: [],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit{
  message: string = '';

  constructor (private apiService: ApiService) {}

  ngOnInit(): void {
      this.fetch();
  }

  fetch (): void {
    this.apiService.getData().subscribe(response => {
      console.log(response);
    })
  }
}
