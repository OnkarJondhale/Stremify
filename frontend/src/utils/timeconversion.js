import { formatDistanceToNow } from 'date-fns';

/**
 * Converts an ISO date string into a relative time format (e.g., "5 minutes ago").
 * @param {string} dateString
 * @returns {string}
 */
export function formatRelativeTime(dateString) {
  if (!dateString) {
    return '';
  }
  try {
    const date = new Date(dateString);
    return `${formatDistanceToNow(date)} ago`;
  } catch (error) {
    console.error("Invalid date string for formatting:", dateString);
    return '';
  }
}