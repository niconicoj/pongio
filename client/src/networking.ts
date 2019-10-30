import * as io from 'socket.io-client';
import { throttle } from 'throttle-debounce';

import { Shared } from './shared/Shared'
import { RenderEngine } from './RenderEngine';
import { Input } from './input';
import { Update } from './types';
import { State } from './state';

export default class Networking {

    private static instance: Networking
    private socket: SocketIOClient.Socket
    private channel: string
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
            this.socket.on(Shared.Constants.MSG_TYPES.JOIN_GAME, (channel: string) => {this.socket, this.join(channel)})
            this.socket.on(Shared.Constants.MSG_TYPES.START_COUNTDOWN, this.processCountDown);
            this.socket.on(Shared.Constants.MSG_TYPES.GAME_UPDATE, this.processGameUpdate);
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
        this.channel = channel
    }

    processGameUpdate(update: Update){
        State.getInstance().processGameUpdate(update)
    }

    processCountDown(countDown: number): void {
        const mainSpinner = document.getElementById('main-spinner')
        const spinnerMessage = document.getElementById('spinner-message')
        spinnerMessage.innerHTML = "Game starts in <br>" + countDown
        if(countDown === 0 ){
            mainSpinner.classList.add('is-hidden')
            spinnerMessage.classList.add('is-hidden')
            Input.getInstance().startCapturingInput()
            RenderEngine.getInstance().startRendering()
        }
    }

    public updateDirection = throttle(20, (dir, channel) => {
        this.socket.emit(Shared.Constants.MSG_TYPES.INPUT, {dir: dir, channel: channel})
    })

    static getInstance() {
        if(!Networking.instance){
            Networking.instance = new Networking
        }
        return Networking.instance
    }

    get getChannel(): string {
        return this.channel
    }
}