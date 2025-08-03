/**
 * Invitation Status Constants
 * Matches iOS Invitation.Status enum exactly
 */
export const InvitationStatus = {
  PENDING: 1,     // case pending = 1
  ACCEPTED: 2,    // case accepted = 2
  EXPIRED: 3,     // case expired = 3
  DECLINED: 4,    // case declined = 4
  CANCELLED: 5,   // case cancelled = 5
} as const;

// Type for the status values
export type InvitationStatusValue = typeof InvitationStatus[keyof typeof InvitationStatus];

// Helper function to get status name from value (for debugging)
export const getInvitationStatusName = (status: number): string => {
  const statusNames = {
    [InvitationStatus.PENDING]: 'pending',
    [InvitationStatus.ACCEPTED]: 'accepted',
    [InvitationStatus.EXPIRED]: 'expired',
    [InvitationStatus.DECLINED]: 'declined',
    [InvitationStatus.CANCELLED]: 'cancelled',
  } as const;
  
  return statusNames[status as InvitationStatusValue] || 'unknown';
};