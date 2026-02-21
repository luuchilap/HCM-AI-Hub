const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Upload an image to the backend
 */
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Upload failed: ${res.status}`);
  }

  return res.json() as Promise<{ url: string; filename: string }>;
}

// ---- Events ----

function mapEvent(e: any): any {
  return {
    _id: e.id,
    slug: e.slug,
    title: { vi: e.titleVi, en: e.titleEn },
    type: e.type,
    subtitle: e.subtitleVi ? { vi: e.subtitleVi, en: e.subtitleEn } : undefined,
    description: { vi: e.descriptionVi, en: e.descriptionEn },
    targetAudience: e.targetAudienceVi ? { vi: e.targetAudienceVi, en: e.targetAudienceEn } : undefined,
    date: e.date,
    startTime: e.startTime,
    endTime: e.endTime,
    venue: {
      name: { vi: e.venueNameVi, en: e.venueNameEn },
      address: e.venueAddress,
      city: e.venueCity,
      googleMapsUrl: e.venueGoogleMapsUrl,
    },
    registrationDeadline: e.registrationDeadline,
    registrationUrl: e.registrationUrl,
    qrCodeUrl: e.qrCodeUrl,
    bannerImage: e.bannerImage,
    status: e.status,
    maxAttendees: e.maxAttendees,
    isFeatured: e.isFeatured,
    agenda: (e.agendaItems || []).map((a: any) => ({
      id: a.id,
      number: a.sortOrder,
      title: { vi: a.titleVi, en: a.titleEn },
      description: a.descriptionVi ? { vi: a.descriptionVi, en: a.descriptionEn } : undefined,
      time: a.timeSlot,
    })),
  };
}

export async function fetchEvents(status?: string) {
  const params = status && status !== 'all' ? `?status=${status}` : '';
  const data = await request<any[]>(`/events${params}`);
  return data.map(mapEvent);
}

export async function fetchEventBySlug(slug: string) {
  const data = await request<any>(`/events/${slug}`);
  return mapEvent(data);
}

export async function fetchFeaturedEvents(limit = 3) {
  const data = await request<any[]>(`/events?featured=true&limit=${limit}`);
  return data.map(mapEvent);
}

export async function fetchUpcomingEvents(limit = 10) {
  const data = await request<any[]>(`/events?status=upcoming&limit=${limit}`);
  return data.map(mapEvent);
}

// ---- Registrations ----

export interface CreateRegistrationData {
  fullName: string;
  email: string;
  phone?: string;
  organization: string;
  role?: string;
  organizationType: string;
  suggestions?: string;
}

export async function createRegistration(eventId: string, data: CreateRegistrationData) {
  return request<any>(`/events/${eventId}/registrations`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function checkRegistration(eventId: string, email: string) {
  return request<{ registered: boolean; status?: string }>(
    `/events/${eventId}/registrations/check?email=${encodeURIComponent(email)}`
  );
}

// ---- Contact ----

export interface CreateContactData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function submitContact(data: CreateContactData) {
  return request<{ id: string; message: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---- Newsletter ----

export async function subscribeNewsletter(email: string, name?: string) {
  return request<{ id: string; message: string }>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  });
}

// ---- Collaborations ----

export interface CreateCollaborationData {
  type: string;
  name: string;
  organization: string;
  email: string;
  phone?: string;
  title: string;
  description: string;
}

export async function submitCollaboration(data: CreateCollaborationData) {
  return request<{ id: string; message: string }>('/collaborations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---- Team ----

export async function fetchTeamMembers() {
  return request<any[]>('/team/members');
}

export async function fetchTeamMember(memberKey: string) {
  return request<any>(`/team/members/${memberKey}`);
}

// ---- Auth ----

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string;
    createdAt: string;
  };
  token: string;
}

export async function authLogin(email: string, password: string) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function authSignUp(name: string, email: string, password: string) {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function authGetMe(token: string) {
  return request<AuthResponse['user']>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- Admin ----

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminGetStats() {
  return request<any>('/admin/stats', { headers: authHeaders() });
}

export async function adminGetContacts() {
  return request<any[]>('/admin/contacts', { headers: authHeaders() });
}

export async function adminMarkContactRead(id: string) {
  return request<any>(`/admin/contacts/${id}/read`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
}

export async function adminDeleteContact(id: string) {
  return request<any>(`/admin/contacts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

export async function adminGetSubscribers() {
  return request<any[]>('/admin/newsletter', { headers: authHeaders() });
}

export async function adminDeleteSubscriber(id: string) {
  return request<any>(`/admin/newsletter/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

export async function adminGetEvents() {
  return request<any[]>('/admin/events', { headers: authHeaders() });
}

export async function adminGetEvent(id: string) {
  return request<any>(`/admin/events/${id}`, { headers: authHeaders() });
}

export async function adminCreateEvent(data: any) {
  return request<any>('/admin/events', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function adminUpdateEvent(id: string, data: any) {
  return request<any>(`/admin/events/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function adminDeleteEvent(id: string) {
  return request<any>(`/admin/events/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

export async function adminGetRegistrations(eventId: string) {
  return request<any[]>(`/admin/events/${eventId}/registrations`, {
    headers: authHeaders(),
  });
}

export async function adminGetCollaborations() {
  return request<any[]>('/admin/collaborations', { headers: authHeaders() });
}

export async function adminMarkCollaborationRead(id: string) {
  return request<any>(`/admin/collaborations/${id}/read`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
}

export async function adminDeleteCollaboration(id: string) {
  return request<any>(`/admin/collaborations/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

export async function adminGetUsers() {
  return request<any[]>('/admin/users', { headers: authHeaders() });
}

export async function adminUpdateUserRole(id: string, role: string) {
  return request<any>(`/admin/users/${id}/role?role=${role}`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
}
