import * as express from 'express'
import * as socketio from 'socket.io'
import { createServer, Server } from 'http'
var cors = require('cors');

import { Shared } from './shared/Shared'

export class Networking {

    private static instance: Networking
    public static readonly PORT: number = 8080
    private app: express.Application
	public server: Server
	public io: SocketIO.Server
	public socket: SocketIO.Socket

    private constructor() {
        this.initServer()
		this.initSocket()
    }

    private initServer(): void {
		this.app = express()
		this.app.use(cors())
		this.app.options('*', cors())
		this.server = createServer(this.app)
	}

	private initSocket(): void {
		this.io = socketio(this.server)
	}
    
    private onSocket(socket: SocketIO.Socket): void {
		//this.socket = socket
		//socket.on(Shared.Constants.MSG_TYPES.REQUEST_GAME, username => {this.socket = socket, this.requestGame(username)})
		//socket.on(Shared.Constants.MSG_TYPES.LEAVE_GAME, channel => {this.socket = socket, this.leaveGame(channel)})
		//socket.on(Shared.Constants.MSG_TYPES.INPUT, this.handleInput)
		//socket.on('disconnect', this.onDisconnect)
    }
    
    static getInstance() {
        if(!Networking.instance){
            Networking.instance = new Networking
        }
        return Networking.instance
    }

    get getIo(): SocketIO.Server {
        return Networking.instance.io
    }

}