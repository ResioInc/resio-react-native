// User related types (updated to match actual API response)
export interface User {
  id: number;
  externalId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  type: UserType;
  phone?: string;
  phoneNumber?: string; // API uses phoneNumber
  propertyId?: number;
  property?: Property;
  currentLeaseId?: number;
  profilePictureUrl?: string;
  photoUrl?: string; // API uses photoUrl for profile photo
  createdAt: string;
  updatedAt: string;
  
  // Additional fields from API response
  unitNumber?: string;
  unitNumberSpace?: string;
  spaceConfiguration?: string;
  statusType?: string;
  startDate?: string;
  endDate?: string;
  floorPlanId?: number;
  unitId?: number;
  paymentsBlocked?: boolean;
  hidden?: boolean;
  buildingName?: string | null;
  LeaseCustomer?: any; // Complex nested object
  customerType?: string;
  leaseId?: number;
  accountId?: number;
  address?: string | null;
  postalCode?: string | null;
  leaseCustomerStatus?: string;
  moveInDate?: string;
  moveOutDate?: string | null;
  lease?: any; // Complex lease object
  entrataIsActive?: boolean;
  hasFutureLease?: boolean;
  leaseIds?: number[];
  appVersion?: string;
  isAndroidDevice?: boolean;
  emailIsVerified?: boolean;
  enablePushNotificationMessages?: boolean;
  enablePushNotificationMaintenance?: boolean;
  enablePushNotificationPayments?: boolean;
  installedAppTimestamp?: string;
  lastInteractionDate?: string;
  timezone?: string | null;
  emailOptIn?: boolean;
  termsApprovedDate?: string;
  cardConnectProfileId?: string;
  preferredPaymentSource?: string;
  deletedAt?: string | null;
  roommateBio?: string;
  lastPaymentDate?: string;
  messagingOptOut?: string | null;
}

export enum UserType {
  RESIDENT = 1,
  GUEST = 2,
  GUARANTOR = 3,
}

// Property related types (updated to match actual API response)
export interface Property {
  id: number;
  marketingName?: string;
  legalName?: string;
  address?: string; // API returns address as a string, not an object!
  photoUrl?: string; // API uses photoUrl (not photoURL)
  logoUrl?: string;
  fastPassPhotoUrl?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string; // Legacy field for backward compatibility
  websites?: {
    home?: string;
    handbook?: string;
  };
  supportsPartialPayments?: boolean;
  officeHours?: OfficeHours[];
  
  // Additional fields from API response
  hasAutopayRun?: boolean;
  pmsType?: string;
  createdAt?: string;
  updatedAt?: string;
  externalId?: string;
  timezone?: string;
  accountingPeriodEndDate?: number;
  rewardsUrl?: string;
  moveInTime?: string;
  naturalKey?: string;
  deletedAt?: string | null;
  glFundingDebitAccountNumber?: string;
  organizationId?: number;
  paymentAccounts?: PaymentAccount[];
  uuid?: string | null;
  maintenanceHours?: MaintenanceHours;
  postMonth?: string;
  externalArCodes?: ExternalArCodes;
  faqUrl?: string;
  cbxWifiInformationFilePath?: string;
  twilioNumber?: string;
  featureFlags?: FeatureFlags;
  organization?: Organization;
  photos?: PropertyPhoto[];
  configurations?: PropertyConfiguration[];
}

// Legacy Address interface - API now returns address as string
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// New interfaces to match API response
export interface PaymentAccount {
  name: string;
  debit: boolean;
  description: string;
  accountNumber: string | number;
}

export interface MaintenanceHours {
  [key: string]: {
    start: string;
    end: string;
  };
}

export interface ExternalArCodes {
  rent?: string;
  lateFee?: string;
  payment?: string;
  resioPayment?: string;
  nonSufficientFundsFee?: string;
}

export interface FeatureFlags {
  id: number;
  property_id: number;
  organization_id: number;
  flags: {
    [key: string]: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: number;
  name: string;
  domain: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  paymentAccounts?: PaymentAccount[];
}

export interface PropertyPhoto {
  id: number;
  photoUrl: string;
  isRemoved: boolean;
  type: {
    name: string;
    enable: boolean;
  };
}

export interface PropertyConfiguration {
  id: number;
  organizationId: number;
  propertyId: number;
  key: string;
  value: any;
  description: string;
  type: string;
  sensitive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface OfficeHours {
  day: string;
  open: string;
  close: string;
}

// Lease related types
export interface Lease {
  id: number;
  leaseNumber: string;
  unitNumber: string;
  startDate: string;
  endDate: string;
  status: LeaseStatus;
  monthlyRent: number;
  balanceDue: number;
  hasAutopaySetup: boolean;
  activeRecurringPayments: RecurringPayment[];
}

export enum LeaseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  EXPIRED = 'expired',
}

export interface LeaseInfo {
  lease: Lease;
  balanceDue: number;
  hasAutopaySetup: boolean;
}

// Payment related types
export interface PaymentMethod {
  id: string;
  type: PaymentType;
  last4: string;
  name: string;
  isDefault?: boolean;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  bankName?: string;
  accountType?: BankAccountType;
}

export enum PaymentType {
  CARD = 'card',
  BANK = 'bank',
}

export enum BankAccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
}

export interface RecurringPayment {
  id: number;
  sourceId: number;
  amount?: string;
  payFullAmount: boolean;
  frequency: string;
  nextPaymentDate: string;
}

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
  paymentMethod?: PaymentMethod;
  description?: string;
}

export enum TransactionType {
  PAYMENT = 'payment',
  CHARGE = 'charge',
  REFUND = 'refund',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface ConvenienceFees {
  creditCard: string;
  debitCard: string;
  bankAccount: string;
}

// Message related types
export interface Conversation {
  id: number;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: number;
  sender: User;
  text: string;
  images?: string[];
  createdAt: string;
  status: MessageStatus;
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

// Maintenance related types
export interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  category: MaintenanceCategory;
  urgency: MaintenanceUrgency;
  status: MaintenanceStatus;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export enum MaintenanceCategory {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  APPLIANCE = 'appliance',
  HVAC = 'hvac',
  OTHER = 'other',
}

export enum MaintenanceUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  EMERGENCY = 'emergency',
}

export enum MaintenanceStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Event related types (matching iOS Event model)
export interface Event {
  id: number;
  propertyId: number;
  name?: string; // This is the title
  location?: string;
  address?: string;
  startTime?: string; // ISO date string from API
  startTimeLocal?: string;
  startTimeLocalFormatted?: string;
  endTime?: string;
  endTimeLocal?: string;
  endTimeLocalFormatted?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string; // API field name
  descriptionHTML?: string; // API: descriptionHtml
  responseDescription?: string; // Legacy field name
  rsvp: boolean;
  rsvpLimit?: number;
  nRsvps?: number; // Number of RSVPs
  nPhotos?: number; // Number of photos
  photos?: Photo[];
}

// Photo interface for events
export interface Photo {
  id: number;
  photoUrl: string;
  label?: string;
}

// Community resource types (matching iOS CommunityResource model)
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
  phoneNumber?: string;
  email?: string;
}

// WiFi related types
export interface WifiInfo {
  unit: string;
  ssid: string;
  password: string;
  supportEmail: string;
  supportPhoneNumber: string;
  supportWebsite: string;
}

export interface UnitInfo {
  wifi?: WifiInfo;
}

export interface UnitInfoResponse {
  unitInfo?: UnitInfo;
  'unit-info'?: UnitInfo; // Backend uses hyphenated key
}

// WiFi connection states
export enum WifiConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  UNKNOWN = 'unknown',
}

// WiFi support types for contact options
export enum WifiSupportType {
  TEXT = 'text',
  EMAIL = 'email',
  WEBSITE = 'website',
}

export interface WifiSupportOption {
  type: WifiSupportType;
  title: string;
  value: string;
  icon: string;
  urlPrefix: string;
}

// WiFi Redux state
export interface WifiState {
  wifiInfo: WifiInfo | null;
  connectionStatus: WifiConnectionStatus;
  isLoading: boolean;
  error: string | null;
}

// Bulletin types - Matching actual API response
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



// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  response: {
    accessToken: string;
    user: User;
  };
}

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  userType: UserType;
}

export interface CheckLeaseResponse {
  success: boolean;
  response: {
    hasLease: boolean;
  };
}

// Enhanced error types for better error handling
export interface AuthError extends ApiError {
  type: 'INVALID_CREDENTIALS' | 'NETWORK_ERROR' | 'SERVER_ERROR' | 'VALIDATION_ERROR';
}

// App State types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  biometricEnabled: boolean;
}

export interface HomeState {
  events: Event[];
  bulletins: Bulletin[];
  resources: CommunityResource[];
  linkedAccounts: any[];
  unreadBulletinsCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface PaymentState {
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  fees: ConvenienceFees | null;
  isLoading: boolean;
  error: string | null;
} 