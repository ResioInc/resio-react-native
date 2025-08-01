// User related types
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  type: UserType;
  phone?: string;
  propertyId?: number;
  property?: Property;
  currentLeaseId?: number;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserType {
  RESIDENT = 1,
  GUEST = 2,
  GUARANTOR = 3,
}

// Property related types
export interface Property {
  id: number;
  marketingName: string;
  legalName: string;
  address: Address;
  photoUrl?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  supportsPartialPayments: boolean;
  officeHours?: OfficeHours[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
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

// Event related types
export interface Event {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime?: string;
  location?: string;
  imageUrl?: string;
  category?: string;
}

// Community resource types
export interface CommunityResource {
  id: number;
  title: string;
  description: string;
  iconName: string;
  url?: string;
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

// Bulletin types
export interface Bulletin {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  isRead: boolean;
  attachments?: Attachment[];
  createdAt: string;
}

export interface Attachment {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
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