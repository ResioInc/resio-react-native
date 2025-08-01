import { Domain, Endpoint, ApiVersion } from '../Domain';

export class AuthEndpoints {
  static login(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V2), 'login');
  }

  static logout(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/logout');
  }

  static checkLease(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V2), 'check-customer-lease');
  }

  static signup(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V2), 'users/account');
  }

  static forgotPassword(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/forgot-password');
  }

  static resetPassword(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V2), 'users/set-password');
  }

  static verifyEmail(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V2), 'users/verification');
  }

  static refreshToken(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/refresh');
  }

  static changePassword(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/change-password');
  }

  static config(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V2), 'config');
  }
} 