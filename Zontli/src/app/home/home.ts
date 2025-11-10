import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  id: number = 0;
  userName: string = "";
  isReadOnly: boolean = true;

  accounts: any = [];

  constructor (private ApiService: ApiService, private router: Router) {
    // This was set because we have used user data in some forms in this page
    // You also can copy and putting this in other components
    const userData = localStorage.getItem("currentUser");
    const data = userData ? JSON.parse(userData) : null;
    const strId = JSON.stringify(data["user_id"]);
    const userName = JSON.stringify(data["name"]);
    this.id = parseInt(strId) ?? 0;
    this.userName = userName ?? null;

    // Getting user accounts
    this.ApiService.getAccounts(this.id).subscribe(res => {
      console.log(res.message);
      this.accounts = res.message;
    })
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
          window.location.reload();
        } else {
          console.log("Something has gone wrong with database");
        }
      },
      error: (err) => {
        console.error(err.message);
      }
    });
  }

  viewState(account_id: any) {
  }
}
