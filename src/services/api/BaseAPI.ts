import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { SecureStorage } from '../storage/SecureStorage';
import { ApiResponse, ApiError as AppApiError } from '@/types';
import { AppConfig } from '@/constants/config';
import { AuthEndpoints } from './endpoints/AuthEndpoints';

export class BaseAPI {
  protected api: AxiosInstance;
  private static instance: BaseAPI;

  protected constructor() {
    this.api = axios.create({
      baseURL: AppConfig.API.BASE_URL,
      timeout: AppConfig.API.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  static getInstance(): BaseAPI {
    if (!BaseAPI.instance) {
      BaseAPI.instance = new BaseAPI();
    }
    return BaseAPI.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        const token = await SecureStorage.getInstance().getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshed = await this.refreshToken();
          if (refreshed && error.config) {
            // Retry original request
            return this.api.request(error.config);
          } else {
            // Refresh failed, logout user
            await this.handleLogout();
          }
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await SecureStorage.getInstance().getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await this.api.post(AuthEndpoints.refreshToken().urlWithoutLogging, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      await SecureStorage.getInstance().saveToken(accessToken);
      await SecureStorage.getInstance().saveRefreshToken(newRefreshToken);
      
      return true;
    } catch (error) {
      return false;
    }
  }

  private async handleLogout(): Promise<void> {
    await SecureStorage.getInstance().clearTokens();
    // TODO: Navigate to login screen
    // TODO: Clear app state
  }

  private formatError(error: AxiosError): AppApiError {
    if (error.response) {
      // Server responded with error
      const data = error.response.data as any;
      return {
        code: data?.code || error.response.status.toString(),
        message: data?.message || error.message,
        details: data?.details,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
      };
    } else {
      // Something else happened
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred',
      };
    }
  }

  // Helper methods for API calls
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  protected async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }
} 