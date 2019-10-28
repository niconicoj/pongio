import{ Player } from './Player'
import { Shared } from './shared/Shared'
import { Networking } from './Networking';

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
        if( Object.keys(this.players).length >= 2){
            this.full = true
            Networking.getInstance().getIo.sockets.in(this.channel).emit(Shared.Constants.MSG_TYPES.JOIN_GAME,this.players)
            this.startGame()
        } else {
            this.full = false
        }
    }

    public removePlayer(socket: SocketIO.Socket): void {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
        this.full = false
    }

    private startGame(): void {
        // we do a countdown and then properly start the game
        let count = 3
        let countDown = setInterval(() => {
            Networking.getInstance().getIo.sockets.in(this.channel).emit(Shared.Constants.MSG_TYPES.START_COUNTDOWN,count)
            count--
        }, 1000)
        setTimeout(() => {
            clearInterval(countDown)
            //setinterval update
        }, 5000);
        
    }

    private update(): void {
        // update game state
    }

    get isFull(): boolean {
        return this.full
    }

    get getChannel(): string {
        return this.channel
    }

    get getPlayers(): { [key: string]: Player } {
        return this.players
    }
}