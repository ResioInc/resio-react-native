import { BaseAPI } from './BaseAPI';
import { LoginResponse, User, SignupRequest } from '@/types';
import { AuthEndpoints } from './endpoints/AuthEndpoints';

class AuthAPIService extends BaseAPI {
  private static authInstance: AuthAPIService;

  static getInstance(): AuthAPIService {
    if (!AuthAPIService.authInstance) {
      AuthAPIService.authInstance = new AuthAPIService();
    }
    return AuthAPIService.authInstance;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>(AuthEndpoints.login().url, {
      email,
      password,
    });
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.post(AuthEndpoints.logout().url);
    } catch (error) {
      // Logout should succeed even if API fails
    }
  }

  async signup(data: SignupRequest): Promise<{ success: boolean; message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      AuthEndpoints.signup().url,
      data
    );
    return response;
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const response = await this.post<{ success: boolean; message: string }>(
      AuthEndpoints.forgotPassword().url,
      { email }
    );
    return response;
  }

  async resetPassword(token: string, password: string): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>(AuthEndpoints.resetPassword().url, {
      token,
      password,
    });
    return response;
  }

  async verifyEmail(email: string, code: string): Promise<{ success: boolean }> {
    const response = await this.post<{ success: boolean }>(AuthEndpoints.verifyEmail().url, {
      email,
      code,
    });
    return response;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.get<{ response: User }>('/user/me');
    return response.response;
  }

  async updateUser(data: Partial<User>): Promise<User> {
    const response = await this.put<{ response: User }>('/user/me', data);
    return response.response;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    const response = await this.post<{ success: boolean }>(AuthEndpoints.changePassword().url, {
      currentPassword,
      newPassword,
    });
    return response;
  }

  async deleteAccount(password: string): Promise<{ success: boolean }> {
    const response = await this.delete<{ success: boolean }>('/user/me', {
      data: { password },
    });
    return response;
  }
}

export const AuthAPI = AuthAPIService.getInstance(); 