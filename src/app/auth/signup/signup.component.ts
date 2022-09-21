import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setLoadingSpinner } from 'src/app/store/shared/shared.action';
import { loginStart, signupStart } from '../state/auth.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm : FormGroup;
  constructor(private store : Store<AppState>) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email : new FormControl('',[Validators.required, Validators.email]),
      password : new FormControl('',[Validators.required, Validators.minLength(6)])
    })
  }
  onSubmit(){
    if(!this.signupForm.valid){
      return;
    }
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    this.store.dispatch(setLoadingSpinner({status : true}));
    this.store.dispatch(signupStart({email,password}));
  }

}
