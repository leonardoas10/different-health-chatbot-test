export interface User {
    _id: string;
    email: string;
    name: string;
}

export class AuthService {
    private static readonly STORAGE_KEY = 'auth_token';
    private static readonly API_BASE = 'http://localhost:8080';

    static saveToken(token: string): void {
        localStorage.setItem(this.STORAGE_KEY, token);
    }

    static getToken(): string | null {
        return localStorage.getItem(this.STORAGE_KEY);
    }

    static removeToken(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    static isAuthenticated(): boolean {
        return !!this.getToken();
    }

    static getCurrentUser(): User | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload as User;
        } catch {
            return null;
        }
    }

    static async mockLogin(): Promise<User> {
        try {
            const response = await fetch(
                `${this.API_BASE}/v1/auth/mock-login`,
                {
                    method: 'GET',
                }
            );

            const data = await response.json();

            if (data.token) {
                this.saveToken(data.token);
                return data.user;
            }

            throw new Error('No token received');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    static logout(): void {
        this.removeToken();
    }
}
