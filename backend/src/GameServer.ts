import * as express from 'express'
import * as socketio from 'socket.io'
import { createServer, Server } from 'http'
var cors = require('cors');

import { Shared } from './shared/Shared'
import { Game } from './Game'
import { Networking } from './Networking';

export class GameServer {

	public static readonly PORT: number = 8080
	private app: express.Application
	private server: Server
	// private io: SocketIO.Server
	private games: {[key: string]: Game} = {}
	// private socket: SocketIO.Socket

	constructor() {
		this.games = {}
		Networking.getInstance()
		this.listen()
	}

	private listen(): void {
		const server = Networking.getInstance().server.listen(Networking.PORT)
		Networking.getInstance().io.on('connection', (socket: SocketIO.Socket) => {
			console.log('new connection')
			Networking.getInstance().socket = socket
			Networking.getInstance().socket.on(Shared.Constants.MSG_TYPES.REQUEST_GAME, username => {Networking.getInstance().socket = socket, this.requestGame(username)})
			Networking.getInstance().socket.on(Shared.Constants.MSG_TYPES.LEAVE_GAME, channel => {Networking.getInstance().socket = socket, this.leaveGame(channel)})
			Networking.getInstance().socket.on(Shared.Constants.MSG_TYPES.INPUT, (input) => {Networking.getInstance().socket = socket, this.handleInput(input)})
			Networking.getInstance().socket.on('disconnect', this.onDisconnect)
		});
	}

	private leaveGame(channel: string): void {
		this.games[channel].removePlayer(Networking.getInstance().socket)
	}

	private requestGame(username: string): void {
		console.log('request received from '+username)
		// if there currently is no game we just create one
		if( Object.keys(this.games).length === 0 ) {
			let channel = Shared.Random.getRandomName()
			let game = new Game(channel)
			this.games[channel] = game
			this.games[channel].addPlayer(Networking.getInstance().socket, username)
			console.log('created first game')
			return
		} else {
			// we looking for a game with an open spot
			if(Object.keys(this.games).some(element => {
				if(!this.games[element].isFull){
					this.games[element].addPlayer(Networking.getInstance().socket, username)
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
					this.games[channel].addPlayer(Networking.getInstance().socket, username)
					console.log('created new game')
					return
				}
			}
		}
	}

	private handleInput(input: {dir: number, channel: string}): void {
		console.log(input)
		this.games[input.channel].handleInput(Networking.getInstance().socket, input.dir)
	}

	private onDisconnect(): void {
		console.log(Networking.getInstance().socket.id)
	}

	get getApp (): express.Application {
		return this.app
	}
}