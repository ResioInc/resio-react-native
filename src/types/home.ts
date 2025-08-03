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

export interface Event {
  id: number;
  title: string;
  startTime: Date;
  location?: string;
  imageUrl?: string;
  rsvp?: boolean;
}

export interface CommunityResource {
  id: number;
  title: string;
  description: string;
}

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