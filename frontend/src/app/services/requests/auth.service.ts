import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { TokenService } from '../token.service';

const loginApi = '/api/login';
const signUpApi = '/api/signup';
const refreshTokenApi = '/api/refreshToken';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  signUpAndLogin(username: any, email: any, password: any): Observable<any> {
    const signUpBody = {
      userName: username,
      email: email,
      password: password,
    };
    const loginBody = {
      email: email,
      password: password,
    };

    return this.http.post(signUpApi, signUpBody).pipe(
      switchMap((registrationResponse: any) => {
        return this.http.post(loginApi, loginBody).pipe(
          tap((loginResponse: any) => {
            const token = loginResponse.accessToken;
            const refresh = loginResponse.refreshToken;
            if (token) {
              this.tokenService.saveToken(token);
              this.tokenService.saveRefreshToken(refresh);
            }
          })
        );
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    const body = {
      email: email,
      password: password,
    };

    return this.http.post(loginApi, body).pipe(
      tap((response: any) => {
        const token = response.accessToken;
        const refresh = response.refreshToken;
        if (token) {
          this.tokenService.saveToken(token);
          this.tokenService.saveRefreshToken(refresh);
        }
      })
    );
  }

  signout() {
    this.tokenService.signOut();
  }

  refreshToken(refreshToken: string | null): Observable<any> {
    const body = {
      refreshToken: refreshToken,
    };
    return this.http.post(refreshTokenApi, body);
  }
}
