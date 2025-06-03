import { AuthService } from './authService.js';

export const registerService = {
    async register(userData) {
        return await AuthService.register(userData);
    }
};

export default registerService;