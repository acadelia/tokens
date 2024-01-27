import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const loginApi = '/api/login';
const signInApi = '/api/singup';
const getAccessToken = 'api/refreshToken';
const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = {
      email: email,
      password: password,
    };

    return this.http.post(loginApi, body).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
        }
      })
    );
  }
}
