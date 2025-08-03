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
    // Match iOS: Endpoint(domain: .resio(.v1), path: "users/events")
    const response = await this.get<{ response: Event[] }>('/api/v1/users/events');
    console.log('🎉 HomeAPI.getEvents() - Raw API Response:', response);
    console.log('🎉 HomeAPI.getEvents() - Events Array:', response.response);
    return response.response || [];
  }

  async getEvent(eventId: number): Promise<Event> {
    const response = await this.get<{ response: Event }>(`/api/v1/users/events/${eventId}`);
    return response.response;
  }

  async setEventRSVP(eventId: number, rsvp: boolean): Promise<void> {
    // Match iOS: Endpoint(domain: .resio(.v1), path: "users/events/rsvp")
    await this.patch('/api/v1/users/events/rsvp', {
      eventId,
      rsvp
    });
  }

  async getBulletins(propertyId?: number, pageNum: number = 0): Promise<Bulletin[]> {
    // Validate inputs to prevent injection
    if (propertyId !== undefined && (!Number.isInteger(propertyId) || propertyId < 0)) {
      throw new Error('Invalid propertyId parameter');
    }
    if (!Number.isInteger(pageNum) || pageNum < 0) {
      throw new Error('Invalid pageNum parameter');
    }

    // Use URLSearchParams for safe URL construction
    const baseUrl = '/api/v2/bulletins';
    let url = baseUrl;
    
    if (propertyId) {
      const params = new URLSearchParams({
        propertyId: propertyId.toString(),
        pageNum: pageNum.toString()
      });
      url = `${baseUrl}?${params.toString()}`;
    }
    
    try {
      const response = await this.get<{ success: boolean; data: Bulletin[] }>(url);
      return response.data || [];
    } catch (error) {
      // Re-throw with sanitized error message for security
      throw new Error('Failed to fetch bulletins');
    }
  }

  async getBulletin(bulletinId: number): Promise<Bulletin> {
    const response = await this.get<{ response: Bulletin }>(`/api/v2/bulletins/${bulletinId}`);
    return response.response;
  }

  async markBulletinAsRead(bulletinId: number): Promise<void> {
    await this.post(`/api/v2/bulletins/${bulletinId}/read`);
  }

  async getUnreadBulletinsCount(propertyId: number): Promise<number> {
    // Match iOS endpoint exactly: /v2/bulletins/unread?propertyId=X
    const response = await this.get<{ success: boolean; count: number }>(`/api/v2/bulletins/unread?propertyId=${propertyId}`);
    return response.count || 0;
  }

  async getCommunityResources(propertyId?: number): Promise<CommunityResource[]> {
    // Match iOS: Endpoint(domain: .resio(.v1), path: "resources?propertyId=...")
    let url = '/api/v1/resources';
    if (propertyId) {
      url = `/api/v1/resources?propertyId=${propertyId}`;
    }
    const response = await this.get<{ response: CommunityResource[] }>(url);
    return response.response || [];
  }

  async getLeases(): Promise<Lease[]> {
    const response = await this.get<{ response: Lease[] }>('/api/v2/leases');
    return response.response || [];
  }

  async getCurrentLease(): Promise<Lease | null> {
    const response = await this.get<{ response: Lease }>('/api/v2/leases/current');
    return response.response || null;
  }

  async getConnectedAccounts(): Promise<any[]> {
    const response = await this.get<{ response: any[] }>('/api/v2/connections');
    return response.response || [];
  }

  async getPropertyInfo(propertyId: number): Promise<any> {
    const response = await this.get<{ response: any }>(`/api/v2/properties/${propertyId}`);
    return response.response;
  }
}

export const HomeAPI = HomeAPIService.getInstance(); 