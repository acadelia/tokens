import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, finalize } from 'rxjs/operators';
import { LoginService } from '../requests/auth.service';
import { TokenService } from '../token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private tokenRefreshSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  isRefreshing: boolean = false;

  constructor(
    private authService: LoginService,
    private tokenService: TokenService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();

    if (token != null) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.tokenRefreshSubject.next(null);
      const refreshToken = this.tokenService.getRefreshToken();

      if (refreshToken) {
        return this.authService.refreshToken(refreshToken).pipe(
          switchMap((refreshResponse) => {
            const newToken = refreshResponse.accessToken;
            this.tokenService.saveToken(newToken);
            window.location.reload();
            const updatedRequest = this.addToken(req, newToken);
            this.tokenRefreshSubject.next(newToken);
            return next.handle(updatedRequest);
          }),
          catchError((refreshError) => {
            this.authService.signout();
            return throwError(refreshError);
          }),
          finalize(() => {
            this.isRefreshing = false;
          })
        );
      }
    }
    return this.tokenRefreshSubject.pipe(
      switchMap((token) => next.handle(this.addToken(req, token)))
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
