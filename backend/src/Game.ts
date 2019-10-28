import{ Player } from './Player'
import { Shared } from './shared/Shared'

export class Game {
 
    private channel: string
    private sockets: { [key: string]: SocketIO.Socket }
    private players: { [key: string]: Player }
    private full: boolean
    private shouldUpdate: boolean
    private lastUpdateTime: Number

    constructor( channel: string ) {
        this.channel = channel
        this.players = {}
        this.sockets = {}
        this.full = false
        this.shouldUpdate = false
        this.lastUpdateTime = Date.now()
    }

    public addPlayer( socket: SocketIO.Socket, username: string ): void {
        let initalPosX = 0;
        if( Object.keys(this.players).length === 0 ) {
            initalPosX = 10
        } else {
            initalPosX = Shared.Constants.MAP_SIZE.X - 10
        }
        this.players[socket.id] = new Player(socket.id, username, initalPosX, Shared.Constants.MAP_SIZE.Y/2)
        this.sockets[socket.id] = socket
        this.sockets[socket.id].join(this.channel)
        this.sockets[socket.id].emit(Shared.Constants.MSG_TYPES.JOIN_GAME,this.channel)
        this.sockets[socket.id].to(this.channel).emit('WELCOME','player '+this.players[socket.id].getUsername+' joined '+this.channel)
        if( Object.keys(this.players).length >= 2){
            this.full = true
        } else {
            this.full = false
        }
    }

    public removePlayer(socket: SocketIO.Socket): void {
        this.sockets[socket.id].to(this.channel).emit('BYE','player '+this.players[socket.id].getUsername+' leaved the game')
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