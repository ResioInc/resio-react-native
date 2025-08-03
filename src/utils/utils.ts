/**
 * Utility functions
 * 
 * This module contains various utility functions that match iOS behavior exactly,
 * including date formatting, text processing, and phone number formatting.
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

export const formatTime = (dateString?: string): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  
  // iOS format: "2:30 PM"
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

/**
 * Text sanitization utilities for user-generated content
 */

/**
 * Sanitize HTML content by removing potentially dangerous elements
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (html?: string): string => {
  if (!html) return '';
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove on* event attributes (onclick, onload, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '');
  
  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: URLs (can contain base64 encoded scripts)
  sanitized = sanitized.replace(/data:/gi, '');
  
  return sanitized.trim();
};

/**
 * Clean description text by removing returns and extra whitespace
 * @param text - Text to clean
 * @returns Cleaned text
 */
export const cleanDescription = (text?: string): string => {
  if (!text) return '';
  
  // Remove returns and normalize whitespace (matching iOS .replaceReturns())
  return text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Validate and sanitize file URLs
 * @param url - URL to validate
 * @returns Sanitized URL or null if invalid
 */
export const sanitizeFileURL = (url?: string): string | null => {
  if (!url) return null;
  
  // Only allow HTTP/HTTPS URLs
  if (!url.match(/^https?:\/\//i)) {
    return null;
  }
  
  // Prevent javascript: and data: URLs
  if (url.match(/^(javascript|data):/i)) {
    return null;
  }
  
  return url.trim();
};

/**
 * Phone number formatting utilities
 * Matches iOS String+Extension.swift formatAsPhoneNumber() exactly
 */

/**
 * Format phone number exactly like iOS formatAsPhoneNumber()
 * Pattern: (###) ###-####
 * Example: "2052104373" → "(205) 210-4373"
 */
export const formatAsPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  const pattern = "(###) ###-####";
  const replacementCharacter = "#";
  
  // Strip all non-numeric characters (matching iOS regex)
  let pureNumber = phoneNumber.replace(/[^0-9]/g, "");
  
  // Insert formatting characters at appropriate positions
  for (let index = 0; index < pattern.length; index++) {
    if (index >= pureNumber.length) return pureNumber;
    
    const patternCharacter = pattern[index];
    if (patternCharacter !== replacementCharacter) {
      pureNumber = pureNumber.slice(0, index) + patternCharacter + pureNumber.slice(index);
    }
  }
  
  return pureNumber;
};

/**
 * Clean phone number to remove all formatting
 * Example: "(205) 210-4373" → "2052104373"
 */
export const cleanPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  return phoneNumber.replace(/[^0-9]/g, "");
};

/**
 * Validate if phone number has correct length (10 digits for US)
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const cleaned = cleanPhoneNumber(phoneNumber);
  return cleaned.length === 10;
};