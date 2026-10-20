export interface SalonBase {
  businessName: string;
  category: 'barber' | 'hair-salon' | 'nail-salon' | 'spa' | 'beauty-salon';
  description: string;
  email: string;
  phone: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  // derived by the API from the service prices, never entered by the owner
  priceRange?: '$' | '$$' | '$$$' | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  daysOfOperation: Record<string, { enabled: boolean; open: string; close: string }>;
  services: SalonService[];
  specialties: string[];
  cancellationPolicy: string;
  // Chairs/stations usable at the same time; null/empty = unlimited
  seats?: number | null;
  timezone?: string;
  // booking rules
  autoConfirm?: boolean;
  minNoticeHours?: number;
  cancellationHours?: number;
  rating?: number | null;
  reviewCount?: number;
}

export interface SalonProfile extends SalonBase {
  id: string;
  teamMembers?: TeamMember[];
  images: string[];
  isApproved: boolean;
  userId: string;
}

export interface TeamMember {
    id: string | number;
    name: string;
    role: string;
    specialties: string;
}

export interface SalonFormData extends Omit<SalonBase, 'specialties'> {
  images: File[];
  specialties: string[];
}

export type SalonFormChange = <K extends keyof SalonFormData>(field: K, value: SalonFormData[K]) => void;

export type PhaseType = 'active' | 'passive';

export interface ServicePhase {
    type: PhaseType;
    duration: number;
}

export interface SalonService {
    id: string | number;
    name: string;
    serviceKey?: string;

    activeDuration: number;
    passiveDuration: number;
    // Ordered phases, e.g. 30 active -> 60 passive -> 30 active. Absent on legacy services.
    phases?: ServicePhase[] | null;
    isActive?: boolean;
  
    price: number;
  
    requiredStaff: number;
    requiredSeats: number;
  
    canOverlap: boolean;
}
  
export interface SalonResource {
    id: string;
    name: string;
    type: string;
    quantity: number;
    available: number;
    assignedServices?: string[];
}