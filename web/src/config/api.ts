/**
 * Central API config for the web admin panel.
 * Set VITE_API_URL in web/.env to point to your backend.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
