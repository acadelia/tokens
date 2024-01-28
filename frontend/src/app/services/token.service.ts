import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'refresh-token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private router: Router) {}

  public saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public saveRefreshToken(token: string): void {
    localStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESHTOKEN_KEY);
  }

  signOut(): void {
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('auth-token');
    this.router.navigate(['/signin']);
  }
}
