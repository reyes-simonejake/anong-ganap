/**
 * Central API config for the mobile app.
 * Set EXPO_PUBLIC_API_URL in mobile/.env to point to your backend.
 *
 * NOTE: When testing on a physical device, use your machine's local IP
 * instead of localhost, e.g. http://192.168.1.x:5000
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
    baseURL: API_URL,

    plan: {
        create: `${API_URL}/api/plan/create`,
        getAll: `${API_URL}/api/plan`,
        getOne: (id: number | string) => `${API_URL}/api/plan/${id}`,
    },

    outfit: {
        generate: `${API_URL}/api/outfit/generate`,
    },

    weather: {
        get: (location: string) =>
            `${API_URL}/api/weather/${encodeURIComponent(location)}`,
    },

    places: {
        nearby: `${API_URL}/api/places/nearby`,
    },

    invitation: {
        create: `${API_URL}/api/invitation/create`,
        send: `${API_URL}/api/invitation/send`,
    },
};
