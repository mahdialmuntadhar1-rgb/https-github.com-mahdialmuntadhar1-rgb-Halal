export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
}

export interface AuthAdapter {

    signIn(): Promise<void>;

    signUp(): Promise<void>;

    signOut(): Promise<void>;

    isAuthenticated(): Promise<boolean>;

    getCurrentUser(): Promise<AuthUser | null>;
}













