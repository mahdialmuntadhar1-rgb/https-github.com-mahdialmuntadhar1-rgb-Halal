import { container } from "./ServiceContainer";
import { api } from "../api";
import { storage } from "../storage";
import { clerkAdapter } from "../auth/adapters/clerk";

export class Engine {

    initialize(): void {

        container.register("api", api);
        container.register("storage", storage);
        container.register("auth", clerkAdapter);

    }

}

export const engine = new Engine();

Object.assign(
    Engine.prototype,
    Engine.prototype,
    {
        get api() {
            return container.resolve("api");
        },
        get auth() {
            return container.resolve("auth");
        },
        get storage() {
            return container.resolve("storage");
        }
    }
);













