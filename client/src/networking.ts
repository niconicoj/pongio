import * as io from 'socket.io-client';
import { throttle } from 'throttle-debounce';
//import { processGameUpdate } from './state';

import { Shared } from './shared/Shared'

export default class Networking {

    private static instance: Networking
    private socket: SocketIOClient.Socket
    private connectedPromise: Promise<unknown>

    private constructor() {
        console.log(('connecting...'))
        this.socket = io(`ws://127.0.0.1:`+Shared.Constants.SOCKET_PORT, { reconnection: false })
        this.connectedPromise = new Promise(resolve => {
            this.socket.on('connect', () => {
                console.log('Connected to server!')
                resolve()
            })
        })
    }

    connect(onGameOver: string) {
        this.connectedPromise.then(() => {
            // Register callbacks
            // socket.on(Shared.Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
            // socket.on(Shared.Constants.MSG_TYPES.GAME_OVER, onGameOver);
            this.socket.on('disconnect', () => {
                console.log('Disconnected from server.')
                document.getElementById('disconnect-modal').classList.remove('hidden')
                document.getElementById('reconnect-button').onclick = () => {
                    window.location.reload()
                };
            });
        })
    }

    play(username: string) {
        this.socket.emit(Shared.Constants.MSG_TYPES.JOIN_GAME, username)
    }

    updateDirection = throttle(20, dir => {
        this.socket.emit(Shared.Constants.MSG_TYPES.INPUT, dir);
    });

    static getInstance() {
        if(!Networking.instance){
            Networking.instance = new Networking
        }
        return Networking.instance
    }
}