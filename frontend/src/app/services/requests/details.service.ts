import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './auth.service';
import { TokenService } from '../token.service';
import { catchError } from 'rxjs';

const detailsApi = '/api/users/details';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  constructor(
    private http: HttpClient,
    private auth: LoginService,
    private tokenService: TokenService
  ) {}

  getDetails() {
    return this.http.get(detailsApi).pipe(
      catchError((error) => {
        console.error('Error getting details:', error);
        this.handleTokenError();
        throw error;
      })
    );
  }

  private handleTokenError(): void {
    this.auth.signout();
  }
}
