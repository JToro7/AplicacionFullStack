import { CONFIG } from '../config/config.js';

export class AuthService {
    static async makeRequest(endpoint, options = {}) {
        try {
            const url = CONFIG.API_BASE_URL + endpoint;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }

            return data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('No se puede conectar al servidor. ¿Está ejecutándose en http://localhost:5000?');
            }
            throw error;
        }
    }

    static async login(email, password) {
        const response = await this.makeRequest(CONFIG.API_ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        return {
            success: true,
            token: response.token,
            user: {
                id: response.user.id,
                email: response.user.email,
                name: response.user.username  
            }
        };
    }

    static async register(userData) {
        const response = await this.makeRequest(CONFIG.API_ENDPOINTS.REGISTER, {
            method: 'POST',
            body: JSON.stringify({
                username: userData.name, 
                email: userData.email,
                password: userData.password
            })
        });

        // Auto-login después del registro
        return await this.login(userData.email, userData.password);
    }
}