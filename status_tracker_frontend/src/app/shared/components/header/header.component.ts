import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="brand" [routerLink]="['/']">
        <span class="logo">ST</span>
        <span class="title">Status Tracker</span>
      </div>
      <nav class="nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a routerLink="/statuses" routerLinkActive="active">Statuses</a>
      </nav>
      <div class="actions">
        <button class="btn outline" (click)="logout.emit()">Logout</button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 20;
      display: grid;
      grid-template-columns: 1fr auto auto;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background: linear-gradient(90deg, rgba(37,99,235,0.08), rgba(249,250,251,1));
      border-bottom: 1px solid #e5e7eb;
      backdrop-filter: blur(6px);
    }
    .brand { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; text-decoration: none; color: inherit;}
    .logo {
      width: 32px; height: 32px; border-radius: 8px;
      background: #2563EB; color: white; display: grid; place-items: center; font-weight: 700;
      box-shadow: 0 6px 16px rgba(37,99,235,0.3);
    }
    .title { font-weight: 600; color: #111827; }
    .nav a { margin-right: 1rem; color: #374151; text-decoration: none; padding: .25rem .5rem; border-radius: 6px; transition: background .2s, color .2s; }
    .nav a.active, .nav a:hover { color: #111827; background: rgba(37,99,235,0.08); }
    .actions .btn { padding: .45rem .8rem; border-radius: 8px; border: 1px solid #d1d5db; background: white; cursor: pointer; transition: all .2s; }
    .actions .btn:hover { border-color: #2563EB; color: #2563EB; box-shadow: 0 4px 12px rgba(37,99,235,0.15); }
    .actions .btn.outline { border-color: #2563EB; color: #2563EB; background: white; }
    @media (max-width: 640px) {
      .nav { display: none; }
      .header { grid-template-columns: 1fr auto; }
    }
  `]
})
export class HeaderComponent {
  @Output() logout = new EventEmitter<void>();
}
