import { apiClient } from './client';
export * from './types';
export * from './services';

// Export the API client singleton
export { apiClient };

// Helper function to initialize API
export const initializeApi = () => {
  console.info('[API] Initializing API client');
  return true;
};
