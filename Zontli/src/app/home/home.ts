import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  userName: number = 0;
  isReadOnly: boolean = true;

  constructor (private ApiService: ApiService) {
    // This was set because we have used user data in some forms in this page
    // You also can copy and putting this in other components
    const userData = localStorage.getItem("currentUser");
    const data = userData ? JSON.parse(userData) : null;
    const strId = JSON.stringify(data["user_id"]);
    this.userName = parseInt(strId) ?? 0;
  }

  onSubmit(formData: any) {
    console.log(formData["form"].value);
    const form = formData["form"].value;
    this.ApiService.addAcount(form["userId"], form["accountType"], form["balance"]).subscribe({
      next: (res) => {
        if(res.success) {
          console.log("DATA VERIFIED: " + res.message);
          const form = document.getElementsByClassName("newAccountContainer");
          form[0].classList.toggle("inactive");
        } else {
          console.log("Something has gone wrong with database");
        }
      },
      error: (err) => {
        console.error(err.message);
      }
    });
  }
}
