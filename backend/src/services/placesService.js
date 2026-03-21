import axios from 'axios';

export const fetchNearbyPlaces = async (location, type = 'restaurant') => {
  try {
    const apiKey = process.env.FOURSQUARE_API_KEY;
    
    // Using Foursquare Places API
    const url = `https://api.foursquare.com/v3/places/search?query=${type}&near=${location}&limit=10`;
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json'
      }
    });

    return response.data.results.map(place => ({
      name: place.name,
      address: place.location.formatted_address,
      category: place.categories[0]?.name || 'General',
      latitude: place.geocodes.main.latitude,
      longitude: place.geocodes.main.longitude
    }));
  } catch (error) {
    console.error('Places API error:', error);
    throw new Error('Failed to fetch nearby places');
  }
};
