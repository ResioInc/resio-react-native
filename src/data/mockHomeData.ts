import { Bulletin, Event, CommunityResource, Connection } from '@/types/home';

export const mockBulletins: Bulletin[] = [
  { 
    id: 1, 
    title: 'Welcome to the building!',
    description: 'We are excited to welcome you to your new home! Please take a moment to review the attached community handbook and amenity information.',
    descriptionHTML: '<p>Welcome to your new home!</p>',
    createdAt: '2024-12-18T10:00:00Z',
    updatedAt: '2024-12-18T10:00:00Z',
    messageReadCount: '0',
    files: [
      {
        id: 1,
        fileUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=400&fit=crop',
        label: 'community-welcome.jpg'
      }
    ],
    highlight: true,
  },
  { 
    id: 2, 
    title: 'New amenity hours',
    description: 'Please note the updated hours for our amenities. The gym will now be open 24/7, and the pool area will have extended summer hours.',
    descriptionHTML: '<p>Please note the updated hours for our amenities.</p>',
    createdAt: '2024-12-19T14:00:00Z',
    updatedAt: '2024-12-19T14:00:00Z',
    messageReadCount: '0',
  },
  {
    id: 3,
    title: 'Holiday party invitation',
    description: 'Join us for our annual holiday celebration! Food, drinks, and entertainment will be provided. Please RSVP by December 20th.',
    descriptionHTML: '<p>Join us for our annual holiday celebration!</p>',
    createdAt: '2024-12-17T09:00:00Z',
    updatedAt: '2024-12-17T09:00:00Z',
    messageReadCount: '1',
    files: [
      {
        id: 2,
        fileUrl: 'https://images.unsplash.com/photo-1482575832494-771f4d4c01d7?w=400&h=400&fit=crop',
        label: 'holiday-party.jpg'
      },
      {
        id: 3,
        fileUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
        label: 'party-details.jpg'
      }
    ],
  },
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