import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateStatusRequest, Status, UpdateStatusRequest } from '../../../core/models/status.models';

@Component({
  selector: 'app-status-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="grid">
        <div class="field">
          <label>Title</label>
          <input type="text" formControlName="title" placeholder="Status title">
        </div>
        <div class="field">
          <label>State</label>
          <select formControlName="state">
            <option value="new">New</option>
            <option value="in_progress">In progress</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label>Description</label>
        <textarea rows="3" formControlName="description" placeholder="Optional description"></textarea>
      </div>
      <div class="actions">
        <button class="btn primary" type="submit">{{ submitLabel }}</button>
        <button class="btn ghost" type="button" (click)="cancel.emit()">Cancel</button>
      </div>
    </form>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: 1fr 180px; gap: .75rem; }
    .field { display: flex; flex-direction: column; gap: .35rem; margin: .5rem 0; }
    .field label { color: #374151; font-weight: 500; }
    .field input, .field select, .field textarea { padding: .6rem .7rem; border-radius: 10px; border: 1px solid #d1d5db; outline: none; transition: border .2s, box-shadow .2s; }
    .field input:focus, .field select:focus, .field textarea:focus { border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.12); }
    .actions { display: flex; gap: .5rem; margin-top: .5rem; }
    .btn.primary { padding: .55rem .9rem; border: none; border-radius: 10px; color: white; background: linear-gradient(90deg, #2563EB, #1d4ed8); cursor: pointer; }
    .btn.ghost { padding: .55rem .9rem; border-radius: 10px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
  `]
})
export class StatusFormComponent implements OnChanges {
  @Input() initial?: Partial<Status> | null = null;
  @Input() submitLabel = 'Save';
  @Output() save = new EventEmitter<CreateStatusRequest | UpdateStatusRequest>();
  @Output() cancel = new EventEmitter<void>();

  private fb = new FormBuilder();
  form = this.fb.group({
    title: ['', Validators.required],
    state: ['new', Validators.required],
    description: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initial'] && this.initial) {
      this.form.patchValue({
        title: this.initial.title ?? '',
        state: this.initial.state ?? 'new',
        description: this.initial.description ?? ''
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.save.emit(this.form.value as CreateStatusRequest);
  }
}
