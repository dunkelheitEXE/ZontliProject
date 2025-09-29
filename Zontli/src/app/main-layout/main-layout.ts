import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
}
