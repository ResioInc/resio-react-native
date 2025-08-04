import { LinkedAccount, Invitation } from '@/types/home';
import { BaseAPI } from './BaseAPI';
import { Event, Bulletin, CommunityResource, Lease, WifiInfo, UnitInfoResponse } from '@/types';
import { InvitationStatus } from '@/constants/invitationStatus';

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

  /**
   * Get linked accounts for the current user
   * Matches iOS: Endpoint(domain: .resio(.v2), path: "users/connections")
   */
  async getLinkedAccounts(): Promise<LinkedAccount[]> {
    try {
      // Match iOS endpoint exactly: /api/v2/users/connections
      const response = await this.get<{ success: boolean; response: LinkedAccount[] }>('/api/v2/users/connections');
      return response.response || [];
    } catch (error) {
      console.error('🔗 HomeAPI.getLinkedAccounts - API Error:', error);
      // Re-throw with sanitized error message for security
      throw new Error('Failed to fetch linked accounts');
    }
  }

  /**
   * Delete a linked account connection
   * Matches iOS: Endpoint.Connections.deleteConnection(with: String(id), status: status)
   */
  async deleteLinkedAccount(accountId: number): Promise<void> {
    // Validate inputs to prevent injection
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new Error('Invalid account ID parameter');
    }

    try {      
      // Match iOS exactly: use invitations endpoint with intent=CANCELLED status
      // iOS enum Status: cancelled = 5
      await this.delete(`/api/v2/users/invitations/${accountId}?intent=${InvitationStatus.CANCELLED}`);
    } catch (error) {
      console.error('🔗 HomeAPI.deleteLinkedAccount - API Error:', error);
      // Re-throw with sanitized error message for security
      throw new Error('Failed to delete linked account');
    }
  }

  /**
   * Get invitations for the current user
   * Matches iOS: Endpoint(domain: .resio(.v2), path: "users/invitations")
   */
  async getInvitations(): Promise<Invitation[]> {
    try {
      // Match iOS endpoint exactly: /api/v2/users/invitations
      const response = await this.get<{ success: boolean; response: Invitation[] }>('/api/v2/users/invitations');
      return response.response || [];
    } catch (error) {
      console.error('📨 HomeAPI.getInvitations - API Error:', error);
      // Re-throw with sanitized error message for security
      throw new Error('Failed to fetch invitations');
    }
  }

  /**
   * Accept an invitation
   * Matches iOS: api.putInvitation(id: invite.id, status: .accepted)
   */
  async acceptInvitation(invitationId: number): Promise<void> {
    // Validate inputs to prevent injection
    if (!Number.isInteger(invitationId) || invitationId <= 0) {
      throw new Error('Invalid invitation ID parameter');
    }

    try {
      // Match iOS: PUT /api/v2/users/invitations/{id} with status: ACCEPTED
      await this.put(`/api/v2/users/invitations/${invitationId}`, { status: InvitationStatus.ACCEPTED });
    } catch (error) {
      console.error('📨 HomeAPI.acceptInvitation - API Error:', error);
      // Re-throw with sanitized error message for security
      throw new Error('Failed to accept invitation');
    }
  }

  /**
   * Decline/Cancel an invitation
   * Matches iOS: api.deleteConnection(id: invite.id, status: invite.isSender ? .cancelled : .declined)
   */
  async declineInvitation(invitationId: number, sender: boolean): Promise<void> {
    // Validate inputs to prevent injection
    if (!Number.isInteger(invitationId) || invitationId <= 0) {
      throw new Error('Invalid invitation ID parameter');
    }

    try {
      // Match iOS logic: status = sender ? .cancelled : .declined
      const status = sender ? InvitationStatus.CANCELLED : InvitationStatus.DECLINED;
      await this.delete(`/api/v2/users/invitations/${invitationId}?intent=${status}`);
    } catch (error) {
      console.error('📨 HomeAPI.declineInvitation - API Error:', error);
      // Re-throw with sanitized error message for security
      throw new Error('Failed to decline invitation');
    }
  }

  /**
   * Send a new invitation
   * Matches iOS: api.postInvitation(message: message, email: email)
   */
  async sendInvitation(email: string, message: string): Promise<void> {
    // Basic validation
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }
    if (!message || message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    try {
      // Match iOS endpoint: POST /api/v2/users/invitations
      await this.post('/api/v2/users/invitations', { email, message });
    } catch (error) {
      console.error('📨 HomeAPI.sendInvitation - API Error:', error);
      
      // Handle specific error cases like iOS does
      // BaseAPI formatError creates: { code: "409", message: "...", details?: ... }
      if (error && typeof error === 'object') {
        const apiError = error as any;
        const statusCode = apiError.code; // "409", "500", etc.
        const errorMessage = apiError.message;
                
        // For 409 (conflict), show a user-friendly duplicate invitation message
        if (statusCode === '409' || statusCode === 409) {
          throw new Error('This person has already been invited');
        }
        
        // For other errors, show the server message if available  
        if (errorMessage && !errorMessage.includes('Request failed with status code')) {
          throw new Error(errorMessage);
        }
      }
      
      // Fallback for unknown errors
      throw new Error('Failed to send invitation');
    }
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
      // Match iOS endpoint exactly: /api/v2/users/unit-information/{leaseId}
      const response = await this.get<{ success: boolean; response: UnitInfoResponse }>(
        `/api/v2/users/unit-information/${leaseId}`
      );
      return response.response || {};
    } catch (error) {
      console.error('📶 HomeAPI.getUnitInfo - API Error:', error);
      
      // Handle 404 errors gracefully like iOS does - just log and return empty
      // iOS behavior: print(errorDescription) and set wifiInfo = nil
      if (error && typeof error === 'object') {
        const apiError = error as any;
        const statusCode = apiError.code;
        
        if (statusCode === '404' || statusCode === 404) {
          return {}; // Return empty response, which will result in null WiFi info
        }
      }
      
      // Re-throw other errors (non-404) for genuine failures
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