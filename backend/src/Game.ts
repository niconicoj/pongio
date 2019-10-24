import{ Player } from './Player'
import { Shared } from './shared/Shared'

export class Game {
 
    private channel: string
    private sockets: { [key: string]: SocketIO.Socket }
    private players: { [key: string]: Player }
    private full: boolean = false
    private lastUpdateTime: Number

    constructor( channel: string ) {
        this.channel = channel
        this.lastUpdateTime = Date.now()
        this.full = false
        this.players = {}
    }

    public addPlayer( socket: SocketIO.Socket, username: string ): void {
        if( Object.keys(this.players).length === 0){
            let initalPosX = 10
        } else {
            let initalPosX = Shared.Constants.MAP_SIZE.X - 10
        }
        this.players[socket.id] = new Player(socket.id, username, Shared.Constants.MAP_SIZE.X, Shared.Constants.MAP_SIZE.Y/2)
        this.sockets[socket.id] = socket
        if( Object.keys(this.players).length >= 2){
            this.full = true
        } else {
            this.full = false
        }
    }

    removePlayer(socket: SocketIO.Socket): void {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
        this.full = false
    }

    private update(): void {
        // update game state
    }

    get isFull(): boolean {
        return this.full
    }
}