export type UserRole = 'ADMIN' | 'MECHANIC' | 'CUSTOMER';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  skills: string[];
  isAvailable: boolean;
  garageId?: string;
  createdAt?: string;
}

export interface Garage {
  _id: string;
  name: string;
  address: string;
  contactNumber: string;
  workingHours: string;
}

export interface Vehicle {
  _id: string;
  ownerId: string;
  garageId: string;
  registrationNumber: string;
  brand: string;
  modelName: string;
  year: number;
  currentMileage: number;
  lastServiceDate?: string;
  createdAt?: string;
}

export type JobStatus = 'CREATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED';

export interface ServiceJob {
  _id: string;
  vehicleId: string | Vehicle;
  garageId: string;
  assignedMechanicId?: string | User;
  status: JobStatus;
  problemDescription: string;
  costEstimate: number;
  finalCost: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryItem {
  _id: string;
  garageId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  lowStockThreshold: number;
  lastUpdated?: string;
}

export interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt?: string;
}

export interface Recommendation {
  type: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedAction: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
