import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) {}

  canActivate(): boolean {
    if (this.tokenService.getToken()) {
      return true;
    } else {
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
