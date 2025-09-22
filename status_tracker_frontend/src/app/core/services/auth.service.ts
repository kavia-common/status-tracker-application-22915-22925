import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, User } from '../models/auth.models';
import { TokenUtil } from '../utils/token.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  // PUBLIC_INTERFACE
  login(payload: LoginRequest): Observable<User> {
    /** Perform login and persist token and user; returns the user details. */
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, payload).pipe(
      tap((res) => {
        TokenUtil.saveToken(res.access_token);
        TokenUtil.saveUser(res.user);
      }),
      map((res) => res.user)
    );
  }

  // PUBLIC_INTERFACE
  logout(): void {
    /** Clears auth data; optionally could call backend logout if available. */
    TokenUtil.clearAll();
  }

  // PUBLIC_INTERFACE
  isAuthenticated(): boolean {
    /** Returns whether a token exists. */
    return !!TokenUtil.getToken();
  }

  // PUBLIC_INTERFACE
  currentUser(): User | null {
    /** Returns currently stored user or null. */
    return TokenUtil.getUser<User>();
  }
}
