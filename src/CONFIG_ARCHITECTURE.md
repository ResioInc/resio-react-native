# Configuration Architecture

This document explains how the React Native app's configuration system mirrors the iOS Swift app's architecture.

## Overview

The configuration system follows React Native best practices while maintaining parity with the iOS app's `CSConstants.swift` and Info.plist pattern.

## Architecture Comparison

### iOS Architecture
```
Info.plist → CSConstants.swift → Domain.swift → API.swift
```

### React Native Architecture  
```
.env files → config.ts → Domain.ts → BaseAPI.ts
```

## File Structure

```
src/
├── constants/
│   ├── config.ts           # Main configuration (like CSConstants.swift)
│   └── index.ts            # Re-exports and UI constants
├── services/
│   └── api/
│       ├── Domain.ts       # Domain and endpoint management
│       ├── BaseAPI.ts      # Base HTTP client
│       ├── AuthAPI.ts      # Auth-specific endpoints
│       └── endpoints/
│           ├── AuthEndpoints.ts  # Auth endpoint definitions
│           └── index.ts          # Endpoint exports
```

## Configuration Usage

### Environment Variables (.env files)
```bash
# .env.development
ENVIRONMENT=DEVELOPMENT
API_BASE_URL=https://api.portal.resio.com
DATADOG_APP_ID=your-app-id
```

### Type-Safe Configuration (config.ts)
```typescript
export const AppConfig = {
  API: {
    BASE_URL: Config.API_BASE_URL || 'https://api.portal.resio.com',
    TIMEOUT: parseInt(Config.API_TIMEOUT || '30000', 10),
  },
  ENVIRONMENT: {
    NAME: ENVIRONMENT,
    IS_DEV: __DEV__ || ENVIRONMENT === 'DEVELOPMENT',
  },
} as const;
```

### Domain Management (Domain.ts)
```typescript
// Similar to iOS Domain.swift
export class Domain {
  get baseURL(): string {
    switch (this.type) {
      case DomainType.RESIO:
        return `${AppConfig.API.BASE_URL}/api/${this.version}`;
    }
  }
}
```

### Endpoint Definitions (AuthEndpoints.ts)
```typescript
// Similar to iOS API+Auth.swift extensions
export class AuthEndpoints {
  static login(): Endpoint {
    return new Endpoint(Domain.resio(ApiVersion.V1), 'auth/login');
  }
}
```

## Benefits

1. **Type Safety**: Full TypeScript support with compile-time checking
2. **Environment Support**: Automatic dev/staging/production configuration
3. **Platform Parity**: Mirrors iOS architecture patterns
4. **Scalability**: Easy to add new domains and endpoints
5. **Maintainability**: Single source of truth for all configuration
6. **Developer Experience**: Auto-completion and validation

## Usage Examples

```typescript
// Using configuration
const apiUrl = AppConfig.API.BASE_URL;
const isDev = AppConfig.ENVIRONMENT.IS_DEV;

// Using endpoints
const loginUrl = AuthEndpoints.login().url;

// Using constants
const buttonHeight = APP_CONSTANTS.TEXT_FIELD_HEIGHT;
const primaryColor = COLORS.PRIMARY;
```

## Environment Setup

1. Create `.env.development` and `.env.production` files
2. Set required variables (see .env.example)
3. Configuration is automatically loaded based on build type
4. Validation runs in development mode

## Debugging

In development mode, the system logs:
- Configuration values on app start
- API endpoints when making requests
- Missing environment variables

This mirrors the iOS app's debug logging patterns. 