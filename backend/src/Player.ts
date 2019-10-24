import { ObjectClass } from "./Object"
import { Shared } from "./shared/Shared"

export class Player extends ObjectClass {

    private username: string

    constructor(id: string, username: string, x: number, y: number) {
        super(id, x, y, 0, 0)
        this.username = username
    }

    get getUsername(): string {
        return this.username
    }
}