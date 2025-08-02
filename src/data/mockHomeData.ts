import { Bulletin, Event, CommunityResource, Connection } from '@/types/home';

export const mockBulletins: Bulletin[] = [
  { id: 1, isRead: false, title: 'Welcome to the building!' },
  { id: 2, isRead: false, title: 'New amenity hours' },
];

export const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Coffee Hour',
    startTime: new Date('2024-12-20T10:00:00'),
    location: 'Community Room',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    rsvp: false,
  },
  {
    id: 2,
    title: 'Fitness Class',
    startTime: new Date('2024-12-21T18:00:00'),
    location: 'Gym',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    rsvp: true,
  },
];

export const mockResources: CommunityResource[] = [
  { id: 1, title: 'Package Room', description: 'Pick up deliveries' },
  { id: 2, title: 'Gym Access', description: '24/7 fitness center' },
  { id: 3, title: 'Bike Storage', description: 'Secure parking' },
  { id: 4, title: 'Study Rooms', description: 'Book quiet spaces' },
];

export const mockConnections: Connection[] = [
  { id: 1, user: { photoUrl: null, firstName: 'John', lastName: 'Doe' } },
  { id: 2, user: { photoUrl: null, firstName: 'Jane', lastName: 'Smith' } },
];