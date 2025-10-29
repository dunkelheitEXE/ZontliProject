import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transfers',
  imports: [FormsModule, CommonModule],
  templateUrl: './transfers.html',
  styleUrl: './transfers.css'
})
export class Transfers {
  id: number = 0;
  userName: string = "";
  isReadOnly: boolean = true;

  accounts: any = [];

  constructor(private apiService: ApiService){
    // This was set because we have used user data in some forms in this page
    // You also can copy and putting this in other components
    const userData = localStorage.getItem("currentUser");
    const data = userData ? JSON.parse(userData) : null;
    const strId = JSON.stringify(data["user_id"]);
    const userName = JSON.stringify(data["name"]);
    this.id = parseInt(strId) ?? 0;
    this.userName = userName ?? null;

    // Getting accounts
    this.apiService.getAccounts(this.id).subscribe(res => {
      console.log(res.message);
      this.accounts = res.message;
    })
  }

  onSubmit(form: any) {
    console.log(form["form"].value);
    const formu = form["form"].value;
    this.apiService.transfer(formu).subscribe(res => {
      console.log(res);
    });
  }
}
