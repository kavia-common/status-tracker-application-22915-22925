import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateStatusRequest, Status, UpdateStatusRequest } from '../models/status.models';

@Injectable({ providedIn: 'root' })
export class StatusService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  // PUBLIC_INTERFACE
  list(): Observable<Status[]> {
    /** Fetch list of statuses for the authenticated user. */
    return this.http.get<Status[]>(`${this.base}/statuses`);
  }

  // PUBLIC_INTERFACE
  get(id: string | number): Observable<Status> {
    /** Fetch a single status by id. */
    return this.http.get<Status>(`${this.base}/statuses/${id}`);
  }

  // PUBLIC_INTERFACE
  create(payload: CreateStatusRequest): Observable<Status> {
    /** Create a new status. */
    return this.http.post<Status>(`${this.base}/statuses`, payload);
  }

  // PUBLIC_INTERFACE
  update(id: string | number, payload: UpdateStatusRequest): Observable<Status> {
    /** Update an existing status. */
    return this.http.put<Status>(`${this.base}/statuses/${id}`, payload);
  }

  // PUBLIC_INTERFACE
  remove(id: string | number): Observable<void> {
    /** Delete a status. */
    return this.http.delete<void>(`${this.base}/statuses/${id}`);
  }
}
