export interface Status {
  id: number | string;
  title: string;
  description?: string;
  state: 'new' | 'in_progress' | 'blocked' | 'done';
  created_at?: string;
  updated_at?: string;
}

export interface CreateStatusRequest {
  title: string;
  description?: string;
  state?: Status['state'];
}

export interface UpdateStatusRequest {
  title?: string;
  description?: string;
  state?: Status['state'];
}
