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
      <div class="card">
        <div class="card-head">
          <div class="logo">ST</div>
          <h2>Welcome back</h2>
          <p class="sub">Sign in to continue</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label>Username</label>
            <input formControlName="username" type="text" placeholder="Enter your username"/>
            <small *ngIf="form.controls.username.invalid && form.controls.username.touched">Username is required</small>
          </div>
          <div class="field">
            <label>Password</label>
            <input formControlName="password" type="password" placeholder="Enter your password"/>
            <small *ngIf="form.controls.password.invalid && form.controls.password.touched">Password is required</small>
          </div>
          <button class="btn primary" [disabled]="form.invalid || loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
          <p class="error" *ngIf="error">{{ error }}</p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrap {
      min-height: 100vh; display: grid; place-items: center; background: #f9fafb;
      background-image: radial-gradient(600px 200px at top left, rgba(37,99,235,0.12), rgba(255,255,255,0));
    }
    .card {
      width: 100%; max-width: 420px; background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.5rem;
      box-shadow: 0 10px 30px rgba(37,99,235,0.15);
    }
    .card-head { text-align: center; margin-bottom: 1rem; }
    .logo { width: 48px; height: 48px; border-radius: 12px; background: #2563EB; color: #fff; display: grid; place-items: center; margin: 0 auto .75rem; font-weight: 700; }
    h2 { color: #111827; margin-bottom: .25rem; }
    .sub { color: #6b7280; }
    .field { display: flex; flex-direction: column; gap: .35rem; margin: .75rem 0; }
    .field label { color: #374151; font-weight: 500; }
    .field input { padding: .65rem .8rem; border-radius: 10px; border: 1px solid #d1d5db; outline: none; transition: border .2s, box-shadow .2s; }
    .field input:focus { border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.12); }
    .btn.primary { width: 100%; padding: .7rem 1rem; border: none; border-radius: 10px; cursor: pointer; color: white; background: linear-gradient(90deg, #2563EB, #1d4ed8); box-shadow: 0 8px 20px rgba(37,99,235,0.35); transition: transform .05s; }
    .btn.primary:disabled { opacity: .7; cursor: not-allowed; box-shadow: none; }
    .btn.primary:active { transform: translateY(1px); }
    .error { color: #EF4444; margin-top: .75rem; text-align: center; }
  `]
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

  onSubmit() {
    this.error = null;
    if (this.form.invalid) return;
    this.loading = true;
    const { username, password } = this.form.value;
    this.auth.login({ username: username!, password: password! }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}
