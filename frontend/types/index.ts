export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'gym_owner' | 'trainer' | 'member';
  status?: 'active' | 'inactive' | 'suspended';
  gymId?: string | any;
  createdAt?: string;
  updatedAt?: string;
}

export interface Gym {
  _id?: string;
  id?: string;
  name: string;
  ownerId?: string | any;
  address?: string;
  phone?: string;
  email?: string;
  qrCodeUrl?: string;
  status?: string;
  createdAt?: string;
}

export interface Membership {
  _id?: string;
  id?: string;
  gymId: string;
  name: string;
  price: number;
  durationMonths: number;
  features?: string[];
  status?: string;
}

export interface Attendance {
  _id?: string;
  id?: string;
  userId: string | User;
  gymId: string;
  checkInTime: string;
  checkOutTime?: string;
  status?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}
