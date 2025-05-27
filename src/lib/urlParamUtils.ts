import { TimelineOptions } from "@/types/TimelineOptions";
import { defaultTimelineOptions } from "./defaultTimelineOptions";

/**
 * Serialize timeline options to a URL-safe string
 * Only includes options that differ from defaults to keep URLs clean
 */
export function serializeTimelineOptions(options: TimelineOptions): string {
  const changes: Record<string, any> = {};
  
  // Compare each option with defaults and only include differences
  Object.keys(options).forEach((key) => {
    const optionKey = key as keyof TimelineOptions;
    
    // Skip complex objects like template and cluster, and zoomMin (always set by data)
    if (typeof options[optionKey] === 'function' || 
        (typeof options[optionKey] === 'object' && options[optionKey] !== null) ||
        key === 'zoomMin') {
      return;
    }
    
    if (options[optionKey] !== defaultTimelineOptions[optionKey]) {
      changes[key] = options[optionKey];
    }
  });
  
  // Convert to URL-safe base64 encoded JSON
  if (Object.keys(changes).length === 0) {
    return ''; // No changes from defaults
  }
  
  return btoa(JSON.stringify(changes));
}

/**
 * Deserialize timeline options from a URL parameter string
 * Merges with defaults to ensure all required properties exist
 */
export function deserializeTimelineOptions(paramValue: string): TimelineOptions {
  if (!paramValue) {
    return { ...defaultTimelineOptions };
  }
  
  try {
    // Decode from base64 and parse JSON
    const changes = JSON.parse(atob(paramValue));
    
    // Merge changes with defaults
    return {
      ...defaultTimelineOptions,
      ...changes,
    };
  } catch (error) {
    console.warn('Failed to parse timeline options from URL:', error);
    return { ...defaultTimelineOptions };
  }
}