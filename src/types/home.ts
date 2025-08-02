export interface Bulletin {
  id: number;
  isRead: boolean;
  title: string;
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