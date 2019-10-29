import { Player } from './Player'
import { Shared } from './shared/Shared'
import { Networking } from './Networking';
import { Ball } from './Ball';

export class Game {

    private channel: string
    private sockets: { [key: string]: SocketIO.Socket }
    private players: { [key: string]: Player }
    private ball: Ball
    private full: boolean
    private shouldUpdate: boolean
    private lastUpdateTime: number
    private updateHandle: NodeJS.Timeout

    constructor(channel: string) {
        this.channel = channel
        this.players = {}
        this.sockets = {}
        this.full = false
        this.shouldUpdate = false
        this.lastUpdateTime = Date.now()
        this.ball = new Ball(1000, 500, 0, 0)
    }

    public addPlayer(socket: SocketIO.Socket, username: string): void {
        let initalPosX = 0;
        if (Object.keys(this.players).length === 0) {
            initalPosX = 100
        } else {
            initalPosX = Shared.Constants.MAP_SIZE.X - 100
        }
        this.players[socket.id] = new Player(socket.id, username, initalPosX, Shared.Constants.MAP_SIZE.Y / 2)
        this.sockets[socket.id] = socket
        this.sockets[socket.id].join(this.channel)
        if (Object.keys(this.players).length >= 2) {
            this.full = true
            // Networking.getInstance().getIo.sockets.in(this.channel).emit(Shared.Constants.MSG_TYPES.JOIN_GAME,this.players)
            this.startGame()
        } else {
            this.full = false
        }
    }

    public removePlayer(socket: SocketIO.Socket): void {
        clearInterval(this.updateHandle)
        delete this.sockets[socket.id];
        delete this.players[socket.id];
        this.full = false
    }

    private startGame(): void {
        // we do a countdown and then properly start the game
        this.shouldUpdate = true
        this.updateHandle = setInterval(() => {
            this.update() 
        }, 1000 / 60)
        let count = 3
        let countDown = setInterval(() => {
            Networking.getInstance().getIo.sockets.in(this.channel).emit(Shared.Constants.MSG_TYPES.START_COUNTDOWN, count)
            count--
        }, 1000)
        setTimeout(() => {
            clearInterval(countDown)
            this.shouldUpdate = true
            this.ball = new Ball(1000, 500, Math.random() * 2 * Math.PI, Shared.Constants.BALL_SPEED)
        }, 4010);

    }

    private update(): void {
        // update game state
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        // Update each player
        Object.keys(this.sockets).forEach(playerID => {
            this.players[playerID].update(dt)
        });

        //Update the ball

        this.ball.update(dt)

        // Send a game update to each player every other time
        if (this.shouldUpdate) {
            Object.keys(this.sockets).forEach(playerID => {
                const socket = this.sockets[playerID];
                const player = this.players[playerID];
                socket.emit(Shared.Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate());
            });
            this.shouldUpdate = false;
        } else {
            this.shouldUpdate = true;
        }
    }

    createUpdate() {
        return {
            t: Date.now(),
            ball: this.ball.serializeForUpdate(),
            players: this.players
        };
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