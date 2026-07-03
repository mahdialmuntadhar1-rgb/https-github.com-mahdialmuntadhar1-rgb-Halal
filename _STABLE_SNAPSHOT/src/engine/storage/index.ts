import { StorageAdapter } from "./StorageAdapter";

export class LocalStorageAdapter implements StorageAdapter {

    get<T>(key: string): T | null {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    set<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}

export const storage = new LocalStorageAdapter();













