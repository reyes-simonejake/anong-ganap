import axios from 'axios';

const isMissingOrPlaceholder = (value) => {
  const normalizedValue = value?.trim().toLowerCase();
  return (
    !normalizedValue ||
    normalizedValue.startsWith('your_') ||
    normalizedValue.includes('placeholder')
  );
};

const buildMockPlace = (
  name,
  location,
  category,
  latitude,
  longitude
) => ({
  name,
  address: `${location}, Philippines`,
  category,
  latitude,
  longitude,
});

const getMockPlaces = (location, type) => {
  const normalizedLocation = location?.toLowerCase() || '';
  const normalizedType = type?.toLowerCase() || 'restaurant';

  if (normalizedLocation.includes('cebu')) {
    return [
      buildMockPlace('Ayala Center Cebu', location, 'Shopping Mall', 10.3181, 123.9056),
      buildMockPlace('Sugbo Mercado IT Park', location, 'Food Court', 10.3306, 123.9063),
      buildMockPlace('Museo Sugbo', location, 'Museum', 10.3032, 123.9114),
      buildMockPlace('Cebu Ocean Park', location, 'Aquarium', 10.2745, 123.8809),
    ];
  }

  if (normalizedLocation.includes('davao')) {
    return [
      buildMockPlace('People\'s Park', location, 'Park', 7.0644, 125.6087),
      buildMockPlace('Roxas Night Market', location, 'Night Market', 7.0707, 125.6113),
      buildMockPlace('Abreeza Mall', location, 'Shopping Mall', 7.0919, 125.6117),
      buildMockPlace('Davao Crocodile Park', location, 'Attraction', 7.1069, 125.6023),
    ];
  }

  if (normalizedLocation.includes('quezon')) {
    return [
      buildMockPlace('Quezon Memorial Circle', location, 'Park', 14.6507, 121.0494),
      buildMockPlace('Maginhawa Food Street', location, 'Restaurant', 14.6442, 121.0608),
      buildMockPlace('UP Diliman Sunken Garden', location, 'Campus Park', 14.6549, 121.0647),
      buildMockPlace('Art in Island', location, 'Museum', 14.6229, 121.0567),
    ];
  }

  if (
    normalizedLocation.includes('makati') ||
    normalizedLocation.includes('taguig') ||
    normalizedLocation.includes('bgc')
  ) {
    return [
      buildMockPlace('Bonifacio High Street', location, 'Lifestyle Center', 14.5507, 121.0515),
      buildMockPlace('Ayala Triangle Gardens', location, 'Park', 14.5566, 121.0233),
      buildMockPlace('The Mind Museum', location, 'Science Museum', 14.5521, 121.045),
      buildMockPlace('Salcedo Weekend Market', location, 'Market', 14.5606, 121.0247),
    ];
  }

  if (
    normalizedLocation.includes('manila') ||
    normalizedLocation.includes('intramuros')
  ) {
    return [
      buildMockPlace('Intramuros', location, 'Historic Site', 14.5896, 120.9747),
      buildMockPlace('National Museum Complex', location, 'Museum', 14.5868, 120.981),
      buildMockPlace('Rizal Park', location, 'Park', 14.5826, 120.9787),
      buildMockPlace('Binondo Food Crawl', location, 'Restaurant', 14.6007, 120.9744),
    ];
  }

  const primaryCategory =
    normalizedType === 'cafe'
      ? 'Cafe'
      : normalizedType === 'park'
        ? 'Park'
        : normalizedType === 'museum'
          ? 'Museum'
          : 'Restaurant';

  return [
    buildMockPlace(`${location} Town Plaza`, location, 'Public Square', 14.5995, 120.9842),
    buildMockPlace(`${location} Local ${primaryCategory}`, location, primaryCategory, 14.601, 120.985),
    buildMockPlace(`${location} Community Park`, location, 'Park', 14.598, 120.9825),
    buildMockPlace(`${location} Weekend Market`, location, 'Market', 14.602, 120.986),
  ];
};

export const fetchNearbyPlaces = async (location, type = 'restaurant') => {
  try {
    const apiKey = process.env.FOURSQUARE_API_KEY;

    if (isMissingOrPlaceholder(apiKey)) {
      return getMockPlaces(location, type);
    }

    const response = await axios.get('https://api.foursquare.com/v3/places/search', {
      params: {
        query: type,
        near: location,
        limit: 10,
      },
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json',
      },
    });

    return response.data.results.map(place => ({
      name: place.name,
      address: place.location.formatted_address,
      category: place.categories[0]?.name || 'General',
      latitude: place.geocodes.main.latitude,
      longitude: place.geocodes.main.longitude,
    }));
  } catch (error) {
    console.error('Places API error:', error);
    throw new Error('Failed to fetch nearby places');
  }
};
