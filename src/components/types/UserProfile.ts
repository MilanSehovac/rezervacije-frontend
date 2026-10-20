export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: 'user' | 'salon_owner' | 'admin';
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    createdAt: string;
    notificationPrefs?: { reminders: boolean; statusUpdates: boolean };
  }

  export interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
  }