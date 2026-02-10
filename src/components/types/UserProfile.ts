export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: number;
    createdAt: string;
  }

  export interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }