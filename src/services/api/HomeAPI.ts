import { BaseAPI } from './BaseAPI';
import { Event, Bulletin, CommunityResource, Lease, WifiInfo, UnitInfoResponse } from '@/types';

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

  /**
   * Get unit WiFi information for a lease
   * Matches iOS: Endpoint(domain: .resio(.v2), path: "users/unit-information/\(leaseID)")
   */
  async getUnitInfo(leaseId: number): Promise<UnitInfoResponse> {
    // Validate inputs to prevent injection
    if (!Number.isInteger(leaseId) || leaseId <= 0) {
      throw new Error('Invalid leaseId parameter');
    }

    try {
      console.log('📶 HomeAPI.getUnitInfo - Fetching WiFi info for lease ID:', leaseId);
      // Match iOS endpoint exactly: /api/v2/users/unit-information/{leaseId}
      const response = await this.get<{ success: boolean; response: UnitInfoResponse }>(
        `/api/v2/users/unit-information/${leaseId}`
      );
      console.log('📶 HomeAPI.getUnitInfo - API Response:', response);
      console.log('📶 HomeAPI.getUnitInfo - Response structure:', JSON.stringify(response.response, null, 2));
      return response.response || {};
    } catch (error) {
      console.error('📶 HomeAPI.getUnitInfo - API Error:', error);
      // Re-throw with sanitized error message for security
      throw new Error('Failed to fetch unit WiFi information');
    }
  }

  /**
   * Get WiFi information directly for current user's active lease
   * Note: This method requires a valid lease ID to be passed from the calling code
   */
  async getCurrentWifiInfo(leaseId?: number): Promise<WifiInfo | null> {
    if (!leaseId) {
      throw new Error('No active lease ID available for WiFi information');
    }
    
    try {
      const unitInfo = await this.getUnitInfo(leaseId);
      // Handle backend's hyphenated key structure
      return unitInfo['unit-info']?.wifi || unitInfo.unitInfo?.wifi || null;
    } catch (error) {
      throw new Error('Failed to fetch current WiFi information');
    }
  }
}

export const HomeAPI = HomeAPIService.getInstance(); 