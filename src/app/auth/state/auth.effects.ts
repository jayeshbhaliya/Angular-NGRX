import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, mergeMap, of, tap } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from 'src/app/store/app.state';
import {
  setErrorMassage,
  setLoadingSpinner,
} from 'src/app/store/shared/shared.action';
import {
  autoLogin,
  autoLogout,
  loginStart,
  loginSuccess,
  signupStart,
  signupSuccess,
} from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private action$: Actions,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) { }

  login$ = createEffect(() => {
    return this.action$.pipe(
      ofType(loginStart),
      exhaustMap((action) => {
        return this.authService.login(action.email, action.password).pipe(
          map((data) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            this.store.dispatch(setErrorMassage({ massage: '' }));
            const user = this.authService.formatUser(data);
            this.authService.setUserInLocalStorage(user);
            return loginSuccess({
              user,
              redirect: true
            });
          }),
          catchError((errRes) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            const errorMassage = this.authService.getErrorMassage(
              errRes.error.error.message
            );
            return of(setErrorMassage({ massage: errorMassage }));
          })
        );
      })
    );
  });

  signup$ = createEffect(() => {
    return this.action$.pipe(
      ofType(signupStart),
      exhaustMap((action) => {
        return this.authService.signup(action.email, action.password).pipe(
          map((data) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            this.store.dispatch(setErrorMassage({ massage: '' }));
            const user = this.authService.formatUser(data);
            this.authService.setUserInLocalStorage(user);
            return signupSuccess({ user ,  redirect: true});
          }),
          catchError((errRes) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            const errorMassage = this.authService.getErrorMassage(
              errRes.error.error.message
            );
            return of(setErrorMassage({ massage: errorMassage }));
          })
        );
      })
    );
  });

  autoLogin$ = createEffect(()=>{
    return this.action$.pipe(ofType(autoLogin),
    mergeMap((action)=>{
      const user = this.authService.getUserFromLocalStorage();
      return of(loginSuccess({user, redirect : false}))
    }));
  });

  loginRedirect$ = createEffect(
    () => {
      return this.action$.pipe(
        ofType(...[loginSuccess, signupSuccess]),
        tap((action) => {
          if(action.redirect){
            this.router.navigate(['/']);
          }
        })
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(()=>{
    return this.action$.pipe(ofType(autoLogout), map((action)=>{
      this.authService.logout();
      this.router.navigate(['auth']);
    }))
  },{dispatch: false})

  // signupRedirect$ = createEffect(
  //   () => {
  //     return this.action$.pipe(
  //       ofType(signupSuccess),
  //       tap((action) => {
  //         this.router.navigate(['/']);
  //       })
  //     );
  //   },
  //   { dispatch: false }
  // );
}
