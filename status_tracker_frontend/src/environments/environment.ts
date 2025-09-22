import { getWindow } from '../app/core/utils/platform.util';

const w = getWindow<any>();
export const environment = {
  production: false,
  // IMPORTANT: Provided via orchestrator; falls back to /api with dev proxy.
  apiBaseUrl: (w && w.__APP_API_BASE_URL__) || '/api',
  appName: 'Status Tracker',
  theme: {
    name: 'Ocean Professional',
    colors: {
      primary: '#2563EB',
      secondary: '#F59E0B',
      success: '#10B981',
      error: '#EF4444',
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#111827'
    }
  }
};
