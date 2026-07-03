import type { AuthAdapter, AuthUser } from "../../interfaces/AuthAdapter";

export class ClerkAdapter implements AuthAdapter {

    async signIn(): Promise<void> {
        throw new Error("Not implemented");
    }

    async signUp(): Promise<void> {
        throw new Error("Not implemented");
    }

    async signOut(): Promise<void> {
        throw new Error("Not implemented");
    }

    async isAuthenticated(): Promise<boolean> {
        return false;
    }

    async getCurrentUser(): Promise<AuthUser | null> {
        return null;
    }
}

export const clerkAdapter = new ClerkAdapter();













