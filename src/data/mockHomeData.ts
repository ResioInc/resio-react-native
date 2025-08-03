import { CommunityResource, Connection } from '@/types/home';

export const mockResources: CommunityResource[] = [
  { 
    id: 1, 
    propertyId: 1,
    position: 0,
    name: 'Package Room',
    description: 'Pick up deliveries',
    icon: 'dollarIcon',
    // Legacy compatibility
    title: 'Package Room',
    iconName: 'dollarIcon'
  },
  { 
    id: 2, 
    propertyId: 1,
    position: 1,
    name: 'Gym Access',
    description: '24/7 fitness center',
    icon: 'buildingIcon',
    // Legacy compatibility
    title: 'Gym Access',
    iconName: 'buildingIcon'
  },
  { 
    id: 3, 
    propertyId: 1,
    position: 2,
    name: 'Bike Storage',
    description: 'Secure parking',
    icon: 'bicycleIcon',
    // Legacy compatibility
    title: 'Bike Storage',
    iconName: 'bicycleIcon'
  },
  { 
    id: 4, 
    propertyId: 1,
    position: 3,
    name: 'Study Rooms',
    description: 'Book quiet spaces',
    icon: 'booksIcon',
    // Legacy compatibility
    title: 'Study Rooms',
    iconName: 'booksIcon'
  },
];

export const mockConnections: Connection[] = [
  { id: 1, user: { photoUrl: null, firstName: 'John', lastName: 'Doe' } },
  { id: 2, user: { photoUrl: null, firstName: 'Jane', lastName: 'Smith' } },
];