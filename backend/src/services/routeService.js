import axios from 'axios';

const ORS_BASE_URL = 'https://api.openrouteservice.org/v2/directions';
const DEFAULT_PROFILE = 'driving-car';

const isMissingOrPlaceholder = (value) => {
  const normalizedValue = value?.trim().toLowerCase();
  return (
    !normalizedValue ||
    normalizedValue.startsWith('your_') ||
    normalizedValue.includes('placeholder')
  );
};

const toCoordinate = (place) => {
  const latitude = Number(place?.latitude);
  const longitude = Number(place?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return [longitude, latitude];
};

const normalizePlaces = (places) => (Array.isArray(places) ? places : []);

const normalizeProfile = (transportPreference) => {
  if (transportPreference === 'foot-walking') {
    return 'foot-walking';
  }

  if (transportPreference === 'cycling-regular') {
    return 'cycling-regular';
  }

  return DEFAULT_PROFILE;
};

const buildFallbackRoute = (places, transportPreference) => {
  const coordinates = normalizePlaces(places).map(toCoordinate).filter(Boolean);
  const stopCount = Math.max(coordinates.length - 1, 0);

  return {
    provider: 'local-fallback',
    profile: normalizeProfile(transportPreference),
    distanceMeters: Math.round(stopCount * 1800),
    durationSeconds: Math.round(stopCount * 8 * 60),
    stopCount: coordinates.length,
    coordinates,
  };
};

const buildRouteRequest = (places, transportPreference) => {
  const coordinates = normalizePlaces(places).map(toCoordinate).filter(Boolean);

  if (coordinates.length < 2) {
    return null;
  }

  return { coordinates, profile: normalizeProfile(transportPreference) };
};

export const getRouteContext = async ({ places = [], transportPreference }) => {
  const fallbackRoute = buildFallbackRoute(places, transportPreference);
  const apiKey = process.env.OPENROUTE_API_KEY;
  const routeRequest = buildRouteRequest(places, transportPreference);

  if (isMissingOrPlaceholder(apiKey) || !routeRequest) {
    return fallbackRoute;
  }

  try {
    const response = await axios.post(
      `${ORS_BASE_URL}/${routeRequest.profile}/geojson`,
      { coordinates: routeRequest.coordinates },
      {
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
        params: { instructions: 'false' },
      }
    );
    const summary = response.data?.features?.[0]?.properties?.summary;

    if (!summary) {
      return fallbackRoute;
    }

    return {
      provider: 'openrouteservice',
      profile: routeRequest.profile,
      distanceMeters: Math.round(Number(summary.distance) || 0),
      durationSeconds: Math.round(Number(summary.duration) || 0),
      stopCount: routeRequest.coordinates.length,
      coordinates: routeRequest.coordinates,
    };
  } catch (error) {
    console.warn(
      'OpenRouteService unavailable; using local route fallback:',
      error.message
    );
    return fallbackRoute;
  }
};
