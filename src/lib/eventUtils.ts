import type { Event, LocalizedString, EventStatus } from "@/types/events";

/**
 * Get localized content based on current language
 */
export function getLocalizedContent(
  content: LocalizedString | undefined,
  locale: string
): string {
  if (!content) return "";
  return locale === "vi" ? content.vi : content.en;
}

/**
 * Format event date for display
 * Vietnamese: "Thứ Năm, 19/12/2025"
 * English: "Thursday, December 19, 2025"
 */
export function formatEventDate(dateString: string, locale: string): string {
  const date = new Date(dateString);

  if (locale === "vi") {
    const weekdays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const weekday = weekdays[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${weekday}, ${day}/${month}/${year}`;
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format event time range
 * "09:00 - 17:00" or "9:00 AM - 5:00 PM"
 */
export function formatEventTime(
  startTime: string,
  endTime: string,
  locale: string
): string {
  if (locale === "vi") {
    return `${startTime} - ${endTime}`;
  }

  // Convert to 12-hour format for English
  const formatTo12Hour = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  };

  return `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`;
}

/**
 * Format registration deadline
 */
export function formatDeadline(dateString: string, locale: string): string {
  const date = new Date(dateString);

  if (locale === "vi") {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Check if registration is still open
 */
export function isRegistrationOpen(event: Event): boolean {
  // Check if event is past or cancelled
  if (event.status === "past" || event.status === "cancelled") {
    return false;
  }

  // Check registration deadline if set
  if (event.registrationDeadline) {
    const deadline = new Date(event.registrationDeadline);
    deadline.setHours(23, 59, 59, 999); // End of day
    return new Date() <= deadline;
  }

  // Check event date
  const eventDate = new Date(event.date);
  return new Date() <= eventDate;
}

/**
 * Check if event has available spots
 */
export function hasAvailableSpots(event: Event): boolean {
  if (!event.maxAttendees) return true;
  const currentAttendees = event.currentAttendees ?? 0;
  return currentAttendees < event.maxAttendees;
}

/**
 * Get remaining spots for an event
 */
export function getRemainingSpots(event: Event): number | null {
  if (!event.maxAttendees) return null;
  const currentAttendees = event.currentAttendees ?? 0;
  return Math.max(0, event.maxAttendees - currentAttendees);
}

/**
 * Calculate event status based on dates
 */
// Calculate event status based on date and time
export function calculateEventStatus(event: Event): EventStatus {
  if (
    event.status === "cancelled" ||
    event.status === "draft" ||
    event.status === "past"
  ) {
    return event.status;
  }

  const now = new Date();

  // Parse date string (YYYY-MM-DD)
  const [year, month, day] = event.date.split("-").map(Number);

  // Parse end time (HH:mm)
  // Default to end of day if parsing fails, though schema enforces strict format
  let hours = 23;
  let minutes = 59;

  if (event.endTime) {
    const timeParts = event.endTime.split(":").map(Number);
    if (timeParts.length === 2 && !isNaN(timeParts[0]) && !isNaN(timeParts[1])) {
      hours = timeParts[0];
      minutes = timeParts[1];
    }
  }

  // Create date object in local time
  // Note: month is 0-indexed in JS Date constructor
  const eventEnd = new Date(year, month - 1, day, hours, minutes);

  if (now > eventEnd) {
    return "past";
  }

  return "upcoming";
}

/**
 * Generate a slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

/**
 * Get days until event
 */
export function getDaysUntilEvent(dateString: string): number {
  const eventDate = new Date(dateString);
  const now = new Date();
  const diffTime = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get days until registration deadline
 */
export function getDaysUntilDeadline(deadlineString: string): number {
  const deadline = new Date(deadlineString);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format relative time (e.g., "in 5 days", "2 days ago")
 */
export function formatRelativeTime(dateString: string, locale: string): string {
  const days = getDaysUntilEvent(dateString);

  if (locale === "vi") {
    if (days === 0) return "Hôm nay";
    if (days === 1) return "Ngày mai";
    if (days > 1) return `Còn ${days} ngày`;
    if (days === -1) return "Hôm qua";
    return `${Math.abs(days)} ngày trước`;
  }

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days > 1) return `In ${days} days`;
  if (days === -1) return "Yesterday";
  return `${Math.abs(days)} days ago`;
}

/**
 * Get event type color classes
 */
export function getEventTypeColor(type: Event["type"]): string {
  const colors: Record<Event["type"], string> = {
    conference: "bg-blue-500/10 text-blue-600 border-blue-200",
    workshop: "bg-green-500/10 text-green-600 border-green-200",
    forum: "bg-purple-500/10 text-purple-600 border-purple-200",
    symposium: "bg-orange-500/10 text-orange-600 border-orange-200",
    seminar: "bg-teal-500/10 text-teal-600 border-teal-200",
  };
  return colors[type];
}

/**
 * Get status badge color classes
 */
export function getStatusColor(status: EventStatus): string {
  const colors: Record<EventStatus, string> = {
    draft: "bg-gray-500/10 text-gray-600 border-gray-200",
    published: "bg-blue-500/10 text-blue-600 border-blue-200",
    upcoming: "bg-green-500/10 text-green-600 border-green-200",
    past: "bg-gray-500/10 text-gray-500 border-gray-200",
    cancelled: "bg-red-500/10 text-red-600 border-red-200",
  };
  return colors[status];
}

/**
 * Strip HTML tags from a string for plain text display
 */
export function stripHtmlTags(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .replace(/&amp;/g, "&") // Replace &amp; with &
    .replace(/&lt;/g, "<") // Replace &lt; with <
    .replace(/&gt;/g, ">") // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .trim();
}