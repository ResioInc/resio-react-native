import { AppConfig } from '@/constants/config';

export enum ApiVersion {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
  V4 = 'v4',
}

export enum DomainType {
  RESIO = 'resio',
  CARD_CONNECT = 'cardConnect',
}

export class Domain {
  constructor(
    public readonly type: DomainType,
    public readonly version?: ApiVersion
  ) {}

  get baseURL(): string {
    switch (this.type) {
      case DomainType.RESIO:
        const apiVersion = this.version || ApiVersion.V1;
        return `${AppConfig.API.BASE_URL}/api/${apiVersion}`;
      case DomainType.CARD_CONNECT:
        return AppConfig.CARDCONNECT.URL;
      default:
        throw new Error(`Unknown domain type: ${this.type}`);
    }
  }

  static resio(version: ApiVersion = ApiVersion.V1): Domain {
    return new Domain(DomainType.RESIO, version);
  }

  static cardConnect(): Domain {
    return new Domain(DomainType.CARD_CONNECT);
  }
}

export class Endpoint {
  constructor(
    private readonly domain: Domain,
    private readonly path: string
  ) {}

  get url(): string {
    const fullUrl = `${this.domain.baseURL}/${this.path}`;
    
    if (AppConfig.ENVIRONMENT.IS_DEV) {
      console.log('🚩 API Endpoint:', fullUrl);
    }
    
    return fullUrl;
  }

  get urlWithoutLogging(): string {
    return `${this.domain.baseURL}/${this.path}`;
  }
} 