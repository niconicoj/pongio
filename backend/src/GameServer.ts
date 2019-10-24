import * as express from 'express'
import * as socketio from 'socket.io'
import { createServer, Server } from 'http'
var cors = require('cors');

import { Shared } from './shared/Shared'
import { Game } from './Game'

export class GameServer {

	public static readonly PORT: number = 8080
	private app: express.Application
	private server: Server
	private io: SocketIO.Server
	private games: {[key: string]: Game} = {}
	private socket: SocketIO.Socket

	constructor() {
		this.games = {}
		this.initServer()
		this.initSocket()
		this.listen()
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

	private listen(): void {
		const server = this.server.listen(GameServer.PORT)
		this.io.on('connection', (socket: SocketIO.Socket) => {
			this.onSocket(socket)
		});
	}

	private onSocket(socket: SocketIO.Socket): void {
		this.socket = socket
		socket.on(Shared.Constants.MSG_TYPES.REQUEST_GAME, username => {this.socket = socket, this.requestGame(username)})
		socket.on(Shared.Constants.MSG_TYPES.LEAVE_GAME, channel => {this.socket = socket, this.leaveGame(channel)})
		socket.on(Shared.Constants.MSG_TYPES.INPUT, this.handleInput)
		socket.on('disconnect', this.onDisconnect)
	}

	private leaveGame(channel: string): void {
		this.games[channel].removePlayer(this.socket)
	}

	private requestGame(username: string): void {
		// if there currently is no game we just create one
		if( Object.keys(this.games).length === 0 ) {
			let channel = Shared.Random.getRandomName()
			let game = new Game(channel)
			this.games[channel] = game
			this.games[channel].addPlayer(this.socket, username)
			console.log('created first game')
			return
		} else {
			// we looking for a game with an open spot
			if(Object.keys(this.games).some(element => {
				if(!this.games[element].isFull){
					this.games[element].addPlayer(this.socket, username)
					console.log('joined an existing game')
					return true
				}
			}) === true ){return}
			// we create a game with a unique name
			let retry = 0
			let success = false
			while(retry<10){
				let channel = Shared.Random.getRandomName()
				if(!this.games.hasOwnProperty(channel)){
					let game = new Game(channel)
					this.games[channel] = game
					this.games[channel].addPlayer(this.socket, username)
					console.log('created new game')
					return
				}
			}
		}
	}

	private handleInput(dir: InputEvent): void {
		// TODO make logic for handling player input
	}

	private onDisconnect(): void {
		//TODO make logic for when player disconnects
	}

	get getApp (): express.Application {
		return this.app
	}
}