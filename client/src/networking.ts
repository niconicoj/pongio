import * as io from 'socket.io-client';
import { throttle } from 'throttle-debounce';

import { Shared } from './shared/Shared'
import { RenderEngine } from './RenderEngine';
import { Input } from './input';

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

    connect() {
        this.connectedPromise.then(() => {
            console.log('registered callback')
            this.socket.on(Shared.Constants.MSG_TYPES.JOIN_GAME, this.join)
            this.socket.on(Shared.Constants.MSG_TYPES.START_COUNTDOWN, this.processCountDown);
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
        this.socket.emit(Shared.Constants.MSG_TYPES.REQUEST_GAME, username)
    }

    join(channel: string) {
        console.log(channel)
    }

    processCountDown(countDown: number): void {
        console.log(countDown)
        if(countDown === 0 ){
            Input.getInstance().startCapturingInput()
            RenderEngine.getInstance().startRendering()
        }
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