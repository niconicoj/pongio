import{ Player } from './Player'

export class Game {
 
    private channel: string
    private sockets: { [key: string]: SocketIO.Socket }
    private players: { [key: string]: Player }
    private full: boolean = false

    constructor(channel: string) {
        this.channel = channel
    }

    public addPlayer(socket: SocketIO.Socket, username: string ){

    }

    get isFull(): boolean {
        return this.full
    }
}