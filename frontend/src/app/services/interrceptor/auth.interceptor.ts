// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpErrorResponse,
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { LoginService } from '../requests/auth.service';
// import { TokenService } from '../token.service';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   constructor(
//     private authService: LoginService,
//     private tokenService: TokenService
//   ) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const token = this.tokenService.getToken();

//     if (token != null) {
//       req = this.addToken(req, token);
//     }

//     return next.handle(req).pipe(
//       catchError((error) => {
//         if (error instanceof HttpErrorResponse && error.status === 401) {
//           return this.handle401Error(req, next);
//         }
//         return throwError(error);
//       })
//     );
//   }

//   private handle401Error(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<any> {
//     const refreshToken = this.tokenService.getRefreshToken();
//     if (refreshToken) {
//       return this.authService.refreshToken(refreshToken).pipe(
//         switchMap((refreshResponse) => {
//           const newToken = refreshResponse.accessToken;
//           this.tokenService.saveToken(newToken);
//           const updatedRequest = this.addToken(req, newToken);
//           return next.handle(updatedRequest);
//         }),
//         catchError((refreshError) => {
//           this.authService.signout();
//           return throwError(refreshError);
//         })
//       );
//     } else {
//       this.authService.signout();
//       return throwError('User session expired. Please log in again.');
//     }
//   }

//   private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
//     return request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }
// }

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
  isRefreshing: any = false;

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

  // private handle401Error(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<any> {
  //   if (!this.refreshingToken) {
  //     this.refreshingToken = true;
  //     const refreshToken = this.tokenService.getRefreshToken();
  //     this.tokenRefreshSubject.next(null);

  //     return this.authService.refreshToken(refreshToken).pipe(
  //       switchMap((refreshResponse) => {
  //         const newToken = refreshResponse.accessToken;
  //         this.tokenService.saveToken(newToken);
  //         this.refreshingToken = false;
  //         this.tokenRefreshSubject.next(newToken);
  //         return next.handle(this.addToken(req, newToken));
  //       }),
  //       catchError((refreshError) => {
  //         this.refreshingToken = false;
  //         this.authService.signout();
  //         return throwError(refreshError);
  //       })
  //     );
  //   } else {
  //     return this.tokenRefreshSubject.pipe(
  //       filter((token) => token !== null),
  //       take(1),
  //       switchMap(() =>
  //         next.handle(this.addToken(req, this.tokenService.getToken()))
  //       )
  //     );
  //   }
  // }

  // private handle401Error(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<any> {
  //   const refreshToken = this.tokenService.getRefreshToken();

  //   if (refreshToken !== null) {
  //     return this.authService.refreshToken(refreshToken).pipe(
  //       switchMap((refreshResponse) => {
  //         const newToken = refreshResponse.accessToken;
  //         this.tokenService.saveToken(newToken);
  //         this.refreshingToken = false;
  //         this.tokenRefreshSubject.next(newToken);
  //         return next.handle(this.addToken(req, newToken));
  //       }),
  //       catchError((refreshError) => {
  //         this.refreshingToken = false;
  //         this.authService.signout();
  //         return throwError(refreshError);
  //       })
  //     );
  //   } else {
  //     // this.refreshingToken = false;
  //     // this.authService.signout();
  //     // return throwError('User session expired. Please log in again.');

  //     return this.tokenRefreshSubject.pipe(
  //       filter((token) => token !== null),
  //       take(1),
  //       switchMap((token) => next.handle(this.addToken(req, token)))
  //     );
  //   }
  // }

  // private handle401Error(
  //   authReq: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<any> {
  //   console.log('Handling 401 error');

  //   if (!this.isRefreshing) {
  //     console.log('Not refreshing, starting refresh process');
  //     this.isRefreshing = true;
  //     this.tokenRefreshSubject.next(null);

  //     const refreshToken = this.tokenService.getRefreshToken();

  //     if (refreshToken !== null) {
  //       console.log('Got refresh token:', refreshToken);
  //       return this.authService.refreshToken(refreshToken).pipe(
  //         switchMap((token: any) => {
  //           console.log('Refresh successful, updating tokens');
  //           const accessToken = token.accessToken;
  //           this.tokenService.saveToken(accessToken);
  //           this.tokenRefreshSubject.next(accessToken);
  //           this.isRefreshing = false;
  //           return next.handle(this.addToken(authReq, accessToken));
  //         }),
  //         catchError((err) => {
  //           console.log('Refresh failed, signing out');
  //           this.isRefreshing = false;
  //           this.tokenService.signOut();
  //           return throwError(err);
  //         })
  //       );
  //     } else {
  //       console.log('No refresh token, signing out');
  //       this.isRefreshing = false;
  //       this.tokenService.signOut();
  //       return throwError('User session expired. Please log in again.');
  //     }
  //   }

  //   console.log('Already refreshing, waiting for new token');
  //   return this.tokenRefreshSubject.pipe(
  //     switchMap((token) => next.handle(this.addToken(authReq, token)))
  //   );
  // }

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
