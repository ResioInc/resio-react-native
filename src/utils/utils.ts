/**
 * Date utility functions
 * 
 * This module contains date formatting functions that match iOS behavior exactly.
 */

/**
 * Format date string to match iOS getRelativeDescription() exactly
 * 
 * iOS Logic:
 * - "Yesterday" for yesterday's date
 * - "h:mm a" format for dates within last 24 hours (e.g., "2:30 PM")
 * - "MMM d" with ordinal suffix for older dates (e.g., "Jan 3rd")
 * 
 * @param dateString - ISO date string to format
 * @returns Formatted date string matching iOS behavior
 */
export const formatRelativeDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // iOS logic: Calendar.current.isDateInYesterday(self)
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // iOS logic: within last 24 hours -> getHourString() "h:mm a"
  const diffTime = now.getTime() - date.getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (diffTime >= 0 && diffTime < twentyFourHours) {
    // iOS format: "h:mm a" (e.g., "2:30 PM")
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase().replace('am', ' AM').replace('pm', ' PM');
  }
  
  // iOS logic: older dates -> getTodayShortString() "MMM d" with ordinals
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  const ordinalSuffix = (n: number) => {
    if (n >= 11 && n <= 13) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd'; 
      case 3: return 'rd';
      default: return 'th';
    }
  };
  return `${month} ${day}${ordinalSuffix(day)}`;
};