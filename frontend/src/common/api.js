import axios from 'axios';
import { lookInSession } from './session';

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_DOMAIN,
});

// Auto-attach auth token from session
api.interceptors.request.use((config) => {
    const userSession = lookInSession("user");
    if (userSession) {
        const { access_token } = JSON.parse(userSession);
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
    }
    return config;
});

export default api;
