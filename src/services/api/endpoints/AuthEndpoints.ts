import { Domain, Endpoint, ApiVersion } from '../Domain';

export class AuthEndpoints {
  static login(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/login');
  }

  static logout(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/logout');
  }

  static signup(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/signup');
  }

  static forgotPassword(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/forgot-password');
  }

  static resetPassword(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/reset-password');
  }

  static verifyEmail(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/verify');
  }

  static refreshToken(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/refresh');
  }

  static changePassword(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/change-password');
  }
} 