import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="auth-wrap">
      <div class="card" role="region" aria-labelledby="loginTitle">
        <div class="card-head">
          <div class="logo" aria-hidden="true">ST</div>
          <h1 id="loginTitle">Welcome back</h1>
          <p class="sub">Sign in to continue</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <div class="field">
            <label for="username">Username</label>
            <input
              id="username"
              formControlName="username"
              type="text"
              placeholder="Enter your username"
              autocomplete="username"
              required
              [attr.aria-invalid]="form.controls.username.invalid && form.controls.username.touched ? 'true' : null"
              [attr.aria-describedby]="form.controls.username.invalid && form.controls.username.touched ? 'usernameError' : null"
            />
            <small id="usernameError" *ngIf="form.controls.username.invalid && form.controls.username.touched">Username is required</small>
          </div>

          <div class="field">
            <label for="password">Password</label>
            <input
              id="password"
              formControlName="password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              required
              [attr.aria-invalid]="form.controls.password.invalid && form.controls.password.touched ? 'true' : null"
              [attr.aria-describedby]="form.controls.password.invalid && form.controls.password.touched ? 'passwordError' : null"
            />
            <small id="passwordError" *ngIf="form.controls.password.invalid && form.controls.password.touched">Password is required</small>
          </div>

          <div class="actions-row">
            <span class="helper">Use your account credentials to access the dashboard.</span>
          </div>

          <button
            class="btn primary"
            type="submit"
            [disabled]="form.invalid || loading"
            [attr.aria-busy]="loading ? 'true' : 'false'"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>

          <p class="error" role="alert" *ngIf="error">{{ error }}</p>
          <p class="status info" *ngIf="!error && loading">Authenticating...</p>
        </form>

        <div class="footer-note">
          Need access? Contact your administrator. <span class="accent">Enterprise</span> ready.
        </div>
      </div>

      <p class="accessibility-note">Keyboard friendly: Tab to move, Enter to submit.</p>
    </div>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = false;
  error: string | null = null;

  // PUBLIC_INTERFACE
  onSubmit() {
    /** Handles login submit and routes to home on success; shows accessible error status on failure. */
    this.error = null;
    if (this.form.invalid) return;
    this.loading = true;
    const { username, password } = this.form.value;

    // Uses AuthService -> backend /auth/login per environment.apiBaseUrl
    this.auth.login({ username: username!, password: password! }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.loading = false;
        // Friendly error mapping
        if (e?.status === 0) {
          this.error = 'Cannot reach server. Please try again in a moment.';
        } else if (e?.status === 401) {
          this.error = e?.error?.message || 'Invalid username or password.';
        } else {
          this.error = e?.error?.message || 'Login failed. Please check your credentials.';
        }
      }
    });
  }
}
