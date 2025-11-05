import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports: [CommonModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment {
  user: any = null;
  data: any = null;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private nav: Router) {
    this.user = this.route.snapshot.paramMap.get('user');
    this.apiService.getLastMovement(this.user).subscribe(res => {
      this.data = res.message[0];
    })
  }

  returnToHome() {
    this.nav.navigate(['/']);
  }
}
