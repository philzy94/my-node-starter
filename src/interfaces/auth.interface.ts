export interface IAuthService {
    register(email: string, password: string): Promise<any>;
    login(email: string, password: string): Promise<string>; // returns JWT token
  }
  