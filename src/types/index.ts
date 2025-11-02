export interface User {
  user_id?: string;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  company?: string;
  gst_number?: string;
  password?: string;
  username?: string;
  roles?: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface Role {
  role_id?: string;
  role_name: string;
  role_level?: number;
  description?: string;
}

export interface RentalItem {
  amount: any;
  // Backend fields
  item_id?: string;
  item_name: string;
  description?: string; // maps to backend `description`
  image_names?: string; // comma-separated URLs stored by backend
  user_id?: string;
  address?: string;
  available?: number;

  // Frontend/UI-friendly aliases (kept for convenience)
  item_description?: string;
  item_category?: string;
  item_price?: number;
  item_availability?: boolean;
  item_location?: string;
  item_images?: string[];
}

export interface RentalOrder {
  orderId?: string;
  userId?: string;
  itemId: string;
  startDate: string; // ISO date e.g. 2025-11-02
  endDate: string;
  totalPrice?: number;
  paymentStatus?: string;
  bookingStatus?: string;
}

