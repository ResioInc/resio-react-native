// Re-export from main types file to maintain compatibility
export interface Bulletin {
  id: number;
  title?: string;
  description?: string; // API field name (iOS maps this to responseDescription)
  descriptionHTML?: string; // API: descriptionHtml
  descriptionJson?: string; // API field
  descriptionHtml?: string; // API field (alternate)
  responseDescription?: string; // Legacy field name (for backward compatibility)
  createdAt: string;
  updatedAt?: string;
  publishDate?: string; // API field
  messageReadCount?: string;
  pinHomepage?: boolean;
  files?: File[];
  highlight?: boolean;
  recipientType?: string; // API field
  author?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }; // API field
}

// File interface matching iOS API response exactly  
export interface File {
  id: number;
  fileUrl: string; // Note: API uses 'fileUrl' not 'fileURL'
  label: string;
}

// Re-export Event and Photo from main types file
export type { Event, Photo } from './index';

export interface CommunityResource {
  id: number;
  propertyId: number; // propertyID in iOS (mapped from propertyId)
  position: number; // Position for grid layout (0-3)
  name?: string; // title in iOS
  description?: string;
  content?: string; // Additional content field from iOS
  icon?: string; // Icon identifier string
  url?: string;
  files?: File[]; // Associated files from iOS
  // Legacy fields for backward compatibility
  title?: string; // Maps to name
  iconName?: string; // Maps to icon
}

// LinkedAccount type matching iOS exactly
export interface LinkedAccount {
  id: number;
  isSender: boolean; // Maps from iOS "sender" field
  user: UserInfo;
  connectedSince: string;
}

// UserInfo type matching iOS exactly
export interface UserInfo {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  type: string; // UserType in iOS
  photoUrl?: string;
}

// Invitation type matching iOS exactly
export interface Invitation {
  id: number;
  sender: boolean; // Maps from iOS "sender" field (keeping original API field name)
  user: UserInfo;
  createdAt: string;
}

// Legacy Connection interface for backward compatibility
export interface Connection {
  id: number;
  user: {
    photoUrl: string | null;
    firstName: string;
    lastName: string;
  };
}

export interface HeaderAnimationValues {
  headerHeight: any;
  headerOpacity: any;
  shadowOpacity: any;
  imageScale: any;
}