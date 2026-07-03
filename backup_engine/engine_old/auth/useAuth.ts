import { clerkAdapter } from "./adapters/clerk";

export function useAuth() {

    return {

        signIn: () => clerkAdapter.signIn(),

        signUp: () => clerkAdapter.signUp(),

        signOut: () => clerkAdapter.signOut(),

        isAuthenticated: () => clerkAdapter.isAuthenticated(),

        getCurrentUser: () => clerkAdapter.getCurrentUser()

    };

}













