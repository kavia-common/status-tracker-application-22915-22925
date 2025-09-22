import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { StatusService } from '../../core/services/status.service';
import { AuthService } from '../../core/services/auth.service';
import { Status } from '../../core/models/status.models';
import { StatusFormComponent } from '../../shared/components/status-form/status-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, DatePipe, NgClass, StatusFormComponent],
  template: `
    <app-header (logout)="doLogout()"></app-header>
    <main class="wrap">
      <section class="hero">
        <div class="left">
          <h1>Dashboard</h1>
          <p class="muted">Track and manage your statuses</p>
        </div>
        <div class="right">
          <button class="btn primary" (click)="startCreate()">+ New Status</button>
        </div>
      </section>

      <section class="grid">
        <div class="panel">
          <div class="panel-head">
            <h3>Your Statuses</h3>
            <input class="search" type="text" placeholder="Search..." [(ngModel)]="q">
          </div>
          <div class="list" *ngIf="!loading && filtered.length; else emptyState">
            <div class="row" *ngFor="let s of filtered" [ngClass]="s.state">
              <div class="info">
                <div class="title">{{ s.title }}</div>
                <div class="meta">
                  <span class="badge" [ngClass]="s.state">{{ s.state }}</span>
                  <span class="time">Updated {{ s.updated_at | date:'short' }}</span>
                </div>
                <div class="desc" *ngIf="s.description">{{ s.description }}</div>
              </div>
              <div class="row-actions">
                <button class="btn ghost" (click)="startEdit(s)">Edit</button>
                <button class="btn danger" (click)="remove(s)">Delete</button>
              </div>
            </div>
          </div>
          <ng-template #emptyState>
            <div class="empty" *ngIf="!loading">No statuses yet. Create your first one.</div>
            <div class="empty" *ngIf="loading">Loading...</div>
          </ng-template>
        </div>

        <div class="panel" *ngIf="mode !== 'idle'">
          <div class="panel-head">
            <h3>{{ mode === 'create' ? 'Create Status' : 'Update Status' }}</h3>
          </div>
          <app-status-form
            [initial]="mode === 'edit' ? selected : null"
            [submitLabel]="mode === 'create' ? 'Create' : 'Update'"
            (save)="save($event)"
            (cancel)="cancel()"
          ></app-status-form>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .wrap { max-width: 1100px; margin: 0 auto; padding: 1rem; }
    .hero { display: flex; align-items: center; justify-content: space-between; margin: 1rem 0 1.25rem; }
    .hero h1 { color: #111827; }
    .muted { color: #6b7280; }
    .btn.primary { padding: .6rem .9rem; border-radius: 10px; border: none; color: white; background: linear-gradient(90deg, #2563EB, #1d4ed8); cursor: pointer; }
    .grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1rem; }
    .panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1rem; box-shadow: 0 10px 24px rgba(2,6,23,0.04); }
    .panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: .5rem; }
    .panel-head h3 { color: #111827; }
    .search { padding: .5rem .6rem; border-radius: 10px; border: 1px solid #d1d5db; }
    .list { display: flex; flex-direction: column; gap: .5rem; }
    .row { display: grid; grid-template-columns: 1fr auto; gap: .5rem; padding: .75rem; border: 1px solid #e5e7eb; border-radius: 12px; }
    .row .title { font-weight: 600; color: #111827; }
    .row .meta { display: flex; gap: .5rem; color: #6b7280; font-size: .9rem; margin-top: .15rem; }
    .badge { padding: .15rem .5rem; border-radius: 999px; font-size: .75rem; border: 1px solid #e5e7eb; }
    .badge.in_progress { background: rgba(37,99,235,0.08); color: #1d4ed8; border-color: rgba(37,99,235,0.25); }
    .badge.blocked { background: rgba(239,68,68,0.08); color: #b91c1c; border-color: rgba(239,68,68,0.25); }
    .badge.done { background: rgba(16,185,129,0.1); color: #065f46; border-color: rgba(16,185,129,0.25); }
    .row-actions { display: flex; gap: .5rem; }
    .btn.ghost { padding: .45rem .8rem; border-radius: 10px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; }
    .btn.danger { padding: .45rem .8rem; border-radius: 10px; border: 1px solid rgba(239,68,68,0.2); background: #fff; color: #b91c1c; cursor: pointer; }
    .empty { color: #6b7280; padding: 1rem 0; text-align: center; }
    @media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }
  `]
})
export class HomeComponent implements OnInit {
  private statusService = inject(StatusService);
  private auth = inject(AuthService);
  private router = inject(Router);

  statuses: Status[] = [];
  loading = false;
  mode: 'idle' | 'create' | 'edit' = 'idle';
  selected: Status | null = null;
  q = '';

  get filtered(): Status[] {
    const q = this.q.toLowerCase().trim();
    if (!q) return this.statuses;
    return this.statuses.filter(s =>
      s.title.toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q)
    );
  }

  ngOnInit(): void {
    this.fetch();
  }

  doLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  fetch() {
    this.loading = true;
    this.statusService.list().subscribe({
      next: (data) => {
        this.statuses = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  startCreate() {
    this.mode = 'create';
    this.selected = null;
  }

  startEdit(s: Status) {
    this.mode = 'edit';
    this.selected = s;
  }

  cancel() {
    this.mode = 'idle';
    this.selected = null;
  }

  save(payload: any) {
    if (this.mode === 'create') {
      this.statusService.create(payload).subscribe({
        next: (created) => {
          this.statuses = [created, ...this.statuses];
          this.cancel();
        }
      });
    } else if (this.mode === 'edit' && this.selected) {
      this.statusService.update(this.selected.id, payload).subscribe({
        next: (updated) => {
          this.statuses = this.statuses.map(s => s.id === updated.id ? updated : s);
          this.cancel();
        }
      });
    }
  }

  remove(s: Status) {
    const w = (globalThis as any)?.window;
    const proceed = w && typeof w.confirm === 'function' ? w.confirm('Delete this status?') : true;
    if (!proceed) return;
    this.statusService.remove(s.id).subscribe({
      next: () => {
        this.statuses = this.statuses.filter(x => x.id !== s.id);
      }
    });
  }
}
