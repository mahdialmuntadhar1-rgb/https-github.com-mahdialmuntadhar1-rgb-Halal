import { container } from "./ServiceContainer";

export class Engine {

    initialize(): void {}

    get api() {
        return container.resolve<any>("api");
    }

    get auth() {
        return container.resolve<any>("auth");
    }

    get storage() {
        return container.resolve<any>("storage");
    }

}













