import axios, {type  AxiosInstance } from 'axios';

/* ================================
   TYPES & INTERFACES
   ================================ */

export interface CreateMeetingPayload {
  type?: 'P2P' | 'SFU';
  visibility?: 'OPEN' | 'PRIVATE';
  allowedUsers?: string[];
}

export interface CreateMeetingResponse {
  message: string;
  roomId: string;
  type: 'P2P' | 'SFU';
  visibility: 'OPEN' | 'PRIVATE';
}

export interface JoinMeetingPayload {
  roomId: string;
}

export interface JoinMeetingResponse {
  message: string;
  roomId: string;
  type: 'P2P' | 'SFU';
}

export interface SyncUserPayload {
  // No payload needed - uses auth token
}

export interface SyncUserResponse {
  message: string;
}

export interface ApiError {
  message?: string;
  error?: string;
  status?: number;
}

/* ================================
   AXIOS INSTANCE SETUP
   ================================ */

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get auth token from Clerk
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      // This will be injected by the component using useAuth
      const token = sessionStorage.getItem('clerk_auth_token');
      return token;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  /**
   * Set auth token (to be called from useAuth hook)
   */
  setAuthToken(token: string): void {
    sessionStorage.setItem('clerk_auth_token', token);
  }

  /**
   * Clear auth token
   */
  clearAuthToken(): void {
    sessionStorage.removeItem('clerk_auth_token');
  }

  /**
   * Get the axios instance for custom requests
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

const apiClient = new ApiClient();

/* ================================
   MEETING ENDPOINTS
   ================================ */

/**
 * Create a new meeting/room
 * POST /meeting/create
 * @param payload - Meeting configuration
 * @returns Created meeting details
 */
export const createMeeting = async (
  payload: CreateMeetingPayload
): Promise<CreateMeetingResponse> => {
  try {
    const response = await apiClient.getClient().post<CreateMeetingResponse>(
      '/meeting/create',
      payload
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Failed to create meeting',
      status: error.response?.status,
    };
    throw apiError;
  }
};

/**
 * Join an existing meeting/room
 * POST /meeting/join
 * @param payload - Room ID to join
 * @returns Join confirmation with meeting details
 */
export const joinMeeting = async (
  payload: JoinMeetingPayload
): Promise<JoinMeetingResponse> => {
  try {
    const response = await apiClient.getClient().post<JoinMeetingResponse>(
      '/meeting/join',
      payload
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Failed to join meeting',
      status: error.response?.status,
    };
    throw apiError;
  }
};

/* ================================
   USER ENDPOINTS
   ================================ */

/**
 * Sync user with database (from Clerk)
 * GET /user/sync
 * @returns Sync confirmation
 */
export const syncUserToDatabase = async (): Promise<SyncUserResponse> => {
  try {
    const response = await apiClient.getClient().get<SyncUserResponse>(
      '/user/sync'
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Failed to sync user',
      status: error.response?.status,
    };
    throw apiError;
  }
};

/* ================================
   HELPER FUNCTIONS
   ================================ */

/**
 * Initialize API with auth token from Clerk
 * Call this in your App component or main layout
 */
export const initializeApiAuth = (token: string): void => {
  apiClient.setAuthToken(token);
};

/**
 * Logout and clear auth
 */
export const logoutApi = (): void => {
  apiClient.clearAuthToken();
};

/**
 * Get the API client instance for custom requests
 */
export const getApiClient = (): AxiosInstance => {
  return apiClient.getClient();
};

/* ================================
   EXPORT DEFAULT
   ================================ */

export default apiClient;
