import { AuthService } from './authService.js';

export const loginService = {
    async login(email, password) {
        return await AuthService.login(email, password);
    }
};

export default loginService;