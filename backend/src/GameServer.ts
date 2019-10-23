import * as express from 'express'
import * as socketio from 'socket.io'
import { createServer, Server } from 'http'
var cors = require('cors');

import { Shared } from './shared/Shared'
import { Game } from './Game'

export class GameServer {

	public static readonly PORT: number = 3000
	private app: express.Application
	private server: Server
	private io: SocketIO.Server
	private games: {[key: string]: Game}

	constructor() {
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
			socket.on(Shared.Constants.MSG_TYPES.REQUEST_GAME, this.requestGame)
			socket.on(Shared.Constants.MSG_TYPES.INPUT, this.handleInput)
			socket.on('disconnect', this.onDisconnect)
		});
	}

	private requestGame(socket: SocketIO.Socket, username: string): void {
		// TODO make logic for joining game
		// Step 1 : Receive player game request
		// Step 2 : determine if we need to create a new game or if there is a game with an open spot
		// Step 3 : if no game with empty spot are found, create a new one. if one is found, mark it as full.
		// Step 4 : send player game channel id. we're done for now. the client should send a join request on the correct channel after that.

		// if there currently is no game we just create one
		if( Object.keys(this.games).length === 0 ) {
			let gameName = Shared.Random.getRandomName()
			let game = new Game(gameName)
			this.games = { ...this.games, gameName: game }
			this.games[gameName].addPlayer(socket, username)
		} else {
			// we looking for a game with an open spot
			Object.keys(this.games).forEach(element => {
				if(!this.games[element].isFull){
					this.games[element].addPlayer(socket, username)
					return
				}
			});
			// we create a game with a unique name
			let retry = 0
			let success = false
			while(retry<10){
				let gameName = Shared.Random.getRandomName()
				if(!this.games.hasOwnProperty(gameName)){
					let game = new Game(gameName)
					this.games = { ...this.games, gameName: game }
					this.games[gameName].addPlayer(socket, username)
					return
				}
			}
			//if we get here it's fucked
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