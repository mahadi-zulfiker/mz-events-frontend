export type Role = 'USER' | 'HOST' | 'ADMIN';

export type EventCategory =
  | 'CONCERT'
  | 'SPORTS'
  | 'GAMING'
  | 'FOOD'
  | 'TECH'
  | 'ART'
  | 'TRAVEL'
  | 'OTHER';

export type EventStatus = 'OPEN' | 'FULL' | 'CANCELLED' | 'COMPLETED';

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  profileImage?: string | null;
  bio?: string | null;
  interests?: string[];
  location?: string | null;
  averageRating?: number | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  address: string;
  minParticipants: number;
  maxParticipants: number;
  joiningFee: number;
  imageUrl?: string | null;
  status: EventStatus;
  hostId: string;
  createdAt: string;
  updatedAt: string;
  host: ApiUser;
  participants?: Participant[];
  reviews?: Review[];
  _count?: {
    participants: number;
  };
}

export interface Participant {
  id: string;
  userId: string;
  eventId: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentId?: string | null;
  user: ApiUser;
}

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  hostId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: ApiUser;
  event?: { id: string; title: string };
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
}
