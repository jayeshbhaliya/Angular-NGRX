import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponceData } from '../model/authResponceData.model';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';
import { Store } from '@ngrx/store';
import { autoLogout } from '../auth/state/auth.actions';
import { AppState } from '../store/app.state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  timeoutInterval: any;
  constructor(private http: HttpClient, private store : Store<AppState>) {}

  login(email: string, password: string): Observable<AuthResponceData> {
    return this.http.post<AuthResponceData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );
  }

  signup(email: string, password: string): Observable<AuthResponceData> {
    return this.http.post<AuthResponceData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );
  }

  formatUser(data: AuthResponceData) {
    const expDate = new Date(new Date().getTime() + +data.expiresIn * 1000);
    const user = new User(data.email, data.idToken, data.localId, expDate);
    return user;
  }

  setUserInLocalStorage(user: User) {
    localStorage.setItem('userData', JSON.stringify(user));
    this.runTimeout(user);
  }

  runTimeout(user: User) {
    const curruntTime = new Date().getTime();
    const expireTime = user.expireDate.getTime();
    const timeInterval = expireTime - curruntTime;

    this.timeoutInterval = setTimeout(() => {
      this.store.dispatch(autoLogout());
    }, timeInterval);
  }

  getUserFromLocalStorage() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const expirationDate = new Date(userData.expirationDate);
      const user = new User(
        userData.email,
        userData.token,
        userData.localId,
        expirationDate
      );
      this.runTimeout(user);
      return user;
    }
    return null;
  }

  logout(){
    localStorage.removeItem('userData');
    if(this.timeoutInterval){
      clearTimeout(this.timeoutInterval);
      this.timeoutInterval = null;
    }
  }

  getErrorMassage(message: string) {
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        return 'Email not ragistered';
      case 'INVALID_PASSWORD':
        return 'The password is invalid';
      case 'EMAIL_EXISTS':
        return 'Email already used by another acount.';
      default:
        return 'Unknown error Occured !!';
    }
  }
}
