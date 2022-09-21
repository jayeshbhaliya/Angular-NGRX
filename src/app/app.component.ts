import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { autoLogin } from './auth/state/auth.actions';
import { getErrorMassage, getLoding } from './store/shared/shared.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Ngrx';
  erroerMessage : Observable<string>;
  showLoding : Observable<boolean>;

  constructor(private store : Store){}

  ngOnInit(): void {
    this.showLoding = this.store.select(getLoding);
    this.erroerMessage = this.store.select(getErrorMassage);
    this.store.dispatch(autoLogin());
  }
}
