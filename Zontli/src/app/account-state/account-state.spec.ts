import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountState } from './account-state';

describe('AccountState', () => {
  let component: AccountState;
  let fixture: ComponentFixture<AccountState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
