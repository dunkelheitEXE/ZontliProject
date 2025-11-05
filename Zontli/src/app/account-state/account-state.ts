import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-state',
  imports: [CommonModule],
  templateUrl: './account-state.html',
  styleUrl: './account-state.css'
})
export class AccountState {

  movements: any = null;
  userData:any = {};
  accountId: any = null;
  accountData: any = null;

  constructor (private apiService: ApiService, private route: ActivatedRoute) {
    const accountId = route.snapshot.paramMap.get('account_id');
    this.accountId = accountId;
    const userId = route.snapshot.paramMap.get('user_id');
    this.apiService.getUserData(userId).subscribe(res=>{
      this.userData = res.message[0];
    });
    this.apiService.getAccountData(accountId).subscribe(res=>{
      if(res.success) {
        this.accountData = res.message[0];
      }
    });
    this.apiService.getStatement(accountId).subscribe(res => {
      if(res.success) {
        this.movements = res.message;
        console.log(this.movements);
      }
    });
  }
}
