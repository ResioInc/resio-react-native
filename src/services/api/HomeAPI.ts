import { BaseAPI } from './BaseAPI';
import { Event, Bulletin, CommunityResource, Lease } from '@/types';

class HomeAPIService extends BaseAPI {
  private static homeInstance: HomeAPIService;

  static getInstance(): HomeAPIService {
    if (!HomeAPIService.homeInstance) {
      HomeAPIService.homeInstance = new HomeAPIService();
    }
    return HomeAPIService.homeInstance;
  }

  async getEvents(): Promise<Event[]> {
    const response = await this.get<{ response: Event[] }>('/events');
    return response.response || [];
  }

  async getEvent(eventId: number): Promise<Event> {
    const response = await this.get<{ response: Event }>(`/events/${eventId}`);
    return response.response;
  }

  async getBulletins(): Promise<Bulletin[]> {
    const response = await this.get<{ response: Bulletin[] }>('/bulletins');
    return response.response || [];
  }

  async getBulletin(bulletinId: number): Promise<Bulletin> {
    const response = await this.get<{ response: Bulletin }>(`/bulletins/${bulletinId}`);
    return response.response;
  }

  async markBulletinAsRead(bulletinId: number): Promise<void> {
    await this.post(`/bulletins/${bulletinId}/read`);
  }

  async getCommunityResources(): Promise<CommunityResource[]> {
    const response = await this.get<{ response: CommunityResource[] }>('/community-resources');
    return response.response || [];
  }

  async getLeases(): Promise<Lease[]> {
    const response = await this.get<{ response: Lease[] }>('/leases');
    return response.response || [];
  }

  async getCurrentLease(): Promise<Lease | null> {
    const response = await this.get<{ response: Lease }>('/leases/current');
    return response.response || null;
  }

  async getConnectedAccounts(): Promise<any[]> {
    const response = await this.get<{ response: any[] }>('/connections');
    return response.response || [];
  }

  async getPropertyInfo(propertyId: number): Promise<any> {
    const response = await this.get<{ response: any }>(`/properties/${propertyId}`);
    return response.response;
  }
}

export const HomeAPI = HomeAPIService.getInstance(); 