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

    this.apiService.getUserAccount(this.user).subscribe({
      next: res =>{
        console.log(res.message);
        this.apiService.getLastMovement(res.message).subscribe({
          next: res => {
            this.data = res.message;
            console.log("DATA");
            console.log(this.data)
          },
          error: ()=> {
            alert("Something has gone wrong");
          }
        });
      },
      error: ()=>{
        alert("Soemthing wrong");
      }
    });

    // console.log(this.user);
    // this.apiService.getLastMovement(this.user).subscribe(res => {
    //   console.log(res);
    //   this.data = res.message[0];
    //   console.log(this.data);
    // })
  }

  returnToHome() {
    this.nav.navigate(['/']);
  }
}
