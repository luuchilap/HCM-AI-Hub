// Event Types
export type EventType = "conference" | "workshop" | "forum" | "symposium" | "seminar";
export type EventStatus = "draft" | "published" | "upcoming" | "past" | "cancelled";
export type RegistrationStatus = "pending" | "confirmed" | "cancelled";

// Bilingual content structure
export interface LocalizedString {
  vi: string;
  en: string;
}

// Agenda item
export interface AgendaItem {
  id: string;
  number: number;
  title: LocalizedString;
  description?: LocalizedString;
  time?: string; // e.g., "09:00 - 09:30"
}

// Venue information
export interface Venue {
  name: LocalizedString;
  address: string;
  city: string;
  googleMapsUrl?: string;
}

// Main Event model
export interface Event {
  _id: string;
  slug: string;
  title: LocalizedString;
  type: EventType;
  subtitle?: LocalizedString;
  description: LocalizedString;
  targetAudience?: LocalizedString;
  agenda: AgendaItem[];
  date: string; // ISO date string YYYY-MM-DD
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  venue: Venue;
  registrationDeadline?: string; // ISO date string
  registrationUrl?: string; // External fallback
  qrCodeUrl?: string;
  bannerImage?: string;
  status: EventStatus;
  maxAttendees?: number;
  currentAttendees?: number;
  isFeatured?: boolean;
  _creationTime?: number;
}

// Registration model
export interface Registration {
  _id: string;
  eventId: string;
  fullName: string;
  email: string;
  phone?: string;
  organization: string;
  role?: string;
  dietaryRequirements?: string;
  status: RegistrationStatus;
  _creationTime?: number;
}

// Form input type (for react-hook-form)
export interface RegistrationFormInput {
  fullName: string;
  email: string;
  phone?: string;
  organization: string;
  role?: string;
  dietaryRequirements?: string;
}

// Event form input type (for admin form)
export interface EventFormInput {
  slug: string;
  title: LocalizedString;
  type: EventType;
  subtitle?: LocalizedString;
  description: LocalizedString;
  targetAudience?: LocalizedString;
  agenda: Omit<AgendaItem, "id">[];
  date: string;
  startTime: string;
  endTime: string;
  venue: Venue;
  registrationDeadline?: string;
  registrationUrl?: string;
  qrCodeUrl?: string;
  bannerImage?: string;
  status: EventStatus;
  maxAttendees?: number;
  isFeatured?: boolean;
}
