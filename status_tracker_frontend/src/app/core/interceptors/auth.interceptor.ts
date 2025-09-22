import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenUtil } from '../utils/token.util';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const token = TokenUtil.getToken();
  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe();
};

export const authErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);
  return next(req).pipe({
    error: (err: any) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        TokenUtil.clearAll();
        router.navigate(['/login']);
      }
      throw err;
    }
  } as any);
};
