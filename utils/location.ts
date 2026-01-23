// Location utility for fetching nearby Muslim-owned businesses using Google Places API
import * as Location from 'expo-location';

export interface LocationBusiness {
  id: string;
  name: string;
  type: 'coffee' | 'restaurant';
  latitude?: number;
  longitude?: number;
  rating?: number;
  userRatingsTotal?: number;
}

const GOOGLE_PLACES_API_KEY = 'AIzaSyDAYU7kAfMTgKvl_JfsI_r5MG2WbTx4KA4';

// Keywords to identify Muslim-owned/halal businesses
const MUSLIM_KEYWORDS = [
  'halal', 'muslim', 'islamic', 'arabic', 'turkish', 'middle eastern',
  'pakistani', 'indian halal', 'arab', 'qahwah', 'masjid', 'mosque',
  'zabiha', 'dhabiha', 'shariah', 'ummah', 'arabic'
];

const COFFEE_KEYWORDS = ['coffee', 'cafe', 'café', 'qahwah', 'kahwa', 'qahwa', 'espresso', 'latte', 'tea', 'chai'];
const RESTAURANT_KEYWORDS = ['restaurant', 'food', 'kitchen', 'grill', 'bistro', 'diner', 'cuisine', 'eatery'];

/**
 * Request location permission
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Check if location permission is granted
 */
export const hasLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};

/**
 * Get user's current location
 */
export const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

/**
 * Search for nearby businesses using Google Places API
 */
export const searchNearbyBusinesses = async (
  latitude: number,
  longitude: number,
  type: 'coffee' | 'restaurant',
  radius: number = 80467 // 50 miles in meters (50 * 1609.34)
): Promise<LocationBusiness[]> => {
  try {
    const searchQuery = type === 'coffee' 
      ? 'muslim coffee cafe halal arabic turkish qahwah islamic' 
      : 'halal restaurant muslim indian pakistani middle eastern turkish zabiha islamic';

    // Use Google Places Text Search API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&location=${latitude},${longitude}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`
    );

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      return getFallbackBusinesses(type);
    }

    const places = data.results || [];
    
    // Filter and map results, then sort by rating (highest first)
    const businesses: LocationBusiness[] = places
      .filter((place: any) => {
        const nameLower = place.name.toLowerCase();
        const types = (place.types || []).join(' ').toLowerCase();
        const address = (place.formatted_address || '').toLowerCase();
        
        // Check if it's the right type
        const isCorrectType = type === 'coffee'
          ? COFFEE_KEYWORDS.some(keyword => nameLower.includes(keyword) || types.includes(keyword))
          : RESTAURANT_KEYWORDS.some(keyword => nameLower.includes(keyword) || types.includes(keyword));
        
        // Check for Muslim/halal indicators
        const hasMuslimIndicator = MUSLIM_KEYWORDS.some(keyword => 
          nameLower.includes(keyword) || types.includes(keyword) || address.includes(keyword)
        );

        return isCorrectType && hasMuslimIndicator;
      })
      .map((place: any) => ({
        id: place.place_id,
        name: place.name,
        type,
        latitude: place.geometry?.location?.lat,
        longitude: place.geometry?.location?.lng,
        rating: place.rating || 0,
        userRatingsTotal: place.user_ratings_total || 0,
      }))
      // Sort by rating (highest first), then by number of reviews
      .sort((a: LocationBusiness, b: LocationBusiness) => {
        if ((b.rating || 0) !== (a.rating || 0)) {
          return (b.rating || 0) - (a.rating || 0); // Higher rating first
        }
        return (b.userRatingsTotal || 0) - (a.userRatingsTotal || 0); // More reviews first if same rating
      })
      .slice(0, 20) // Limit to top 20 results
      .map((business: LocationBusiness) => {
        // Remove rating fields from final output (only need names for words)
        const { rating, userRatingsTotal, ...rest } = business;
        return rest;
      });

    console.log(`Found ${businesses.length} ${type} businesses within 50 miles`);
    return businesses.length > 0 ? businesses : getFallbackBusinesses(type);
  } catch (error) {
    console.error('Error searching nearby businesses:', error);
    return getFallbackBusinesses(type);
  }
};

/**
 * Fallback data when API is unavailable or no results found
 */
const getFallbackBusinesses = (type: 'coffee' | 'restaurant'): LocationBusiness[] => {
  if (type === 'coffee') {
    return [
      { id: '1', name: 'Qahwah House', type: 'coffee' },
      { id: '2', name: 'Karak Chai Spot', type: 'coffee' },
      { id: '3', name: 'Zamzam Café', type: 'coffee' },
      { id: '4', name: 'Arabica Beans', type: 'coffee' },
      { id: '5', name: 'Turkish Delight Café', type: 'coffee' },
    ];
  } else {
    return [
      { id: '1', name: 'Halal Grill', type: 'restaurant' },
      { id: '2', name: 'Shawarma Express', type: 'restaurant' },
      { id: '3', name: 'Biriyani House', type: 'restaurant' },
      { id: '4', name: 'Kebab Corner', type: 'restaurant' },
      { id: '5', name: 'Halal Pizza Co', type: 'restaurant' },
    ];
  }
};

/**
 * Get nearby Muslim coffee shops based on user location
 */
export const getNearbyCoffeeShops = async (
  latitude?: number,
  longitude?: number
): Promise<LocationBusiness[]> => {
  if (latitude && longitude) {
    return await searchNearbyBusinesses(latitude, longitude, 'coffee');
  }
  
  // Try to get current location
  const location = await getCurrentLocation();
  if (location) {
    return await searchNearbyBusinesses(location.latitude, location.longitude, 'coffee');
  }
  
  // Fallback to seed data
  return getFallbackBusinesses('coffee');
};

/**
 * Get nearby halal food spots based on user location
 */
export const getNearbyHalalSpots = async (
  latitude?: number,
  longitude?: number
): Promise<LocationBusiness[]> => {
  if (latitude && longitude) {
    return await searchNearbyBusinesses(latitude, longitude, 'restaurant');
  }
  
  // Try to get current location
  const location = await getCurrentLocation();
  if (location) {
    return await searchNearbyBusinesses(location.latitude, location.longitude, 'restaurant');
  }
  
  // Fallback to seed data
  return getFallbackBusinesses('restaurant');
};

/**
 * Normalize business name (remove common suffixes, extra spaces, etc.)
 */
const normalizeBusinessName = (name: string): string => {
  // Remove common business suffixes and normalize
  let normalized = name
    .trim()
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/\b(inc|llc|ltd|corp|restaurant|restaurant|cafe|café|coffee|shop|spot|house|place|kitchen|grill)\b/gi, '')
    .trim();
  
  // Capitalize first letter of each word
  return normalized
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

/**
 * Extract business names as words for the game, normalized and deduplicated
 */
export const businessesToWords = (businesses: LocationBusiness[]): string[] => {
  const normalizedNames = businesses.map(business => normalizeBusinessName(business.name));
  
  // Remove duplicates (case-insensitive)
  const uniqueNames = normalizedNames.filter((name, index, self) => 
    index === self.findIndex(n => n.toLowerCase() === name.toLowerCase())
  );
  
  // Remove very short names (less than 2 characters) and empty strings
  return uniqueNames.filter(name => name.length >= 2);
};
