import { debounce } from 'throttle-debounce';
import Assets from './Assets';
//import { getCurrentState } from './state';

import { Shared } from './shared/Shared'

export class RenderEngine {

    private static instance: RenderEngine
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private renderInt: number

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('game-canvas')
        this.canvas.classList.remove('is-hidden')
        this.context = this.canvas.getContext('2d')
        //window.addEventListener('resize', debounce(40, setCanvasDimensions))
        this.setCanvasDimensions()
        this.renderInt = setInterval(this.renderMainMenu, 1000 / 60)
    }



    public setCanvasDimensions(): void {
        // we just want the canvas to be at the correct height/width ratio 2:1
        let width = Math.min(window.innerWidth, window.innerHeight * 2)
        this.canvas.width = width
        this.canvas.height = width / 2
    }

    render() {
        //   const { me, others, bullets } = getCurrentState();
        //   if (!me) {
        //     return;
        //   }

        // Draw background
        this.renderBackground()

        //   // Draw boundaries
        //   context.strokeStyle = 'black';
        //   context.lineWidth = 1;
        //   // context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

        //   // Draw all bullets
        //   bullets.forEach(renderBullet.bind(null, me));

        //   // Draw all players
        //   renderPlayer(me, me);
        //   others.forEach(renderPlayer.bind(null, me));
        this.renderPlayer({
            direction: 0,
            id: '123',
            speed: 0, 
            username: 'nico',
            x:502,
            y:128
        })
    }

    renderBackground() {
        this.context.fillStyle = '#282832'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderMainMenu() {
        const t = Date.now() / 7500;
        const x = Shared.Constants.MAP_SIZE.X
        const y = Shared.Constants.MAP_SIZE.Y
        this.renderBackground();
    }

    renderPlayer(player: { direction: number; id: string; speed: number; username: string; x:number; y:number}) {
        let { x, y, direction } = player;
        // const canvasX = canvas.width / 2 + x - me.x;
        // const canvasY = canvas.height / 2 + y - me.y;

        // // Draw ship
        this.context.save();
        // context.translate(canvasX, canvasY);
        // context.rotate(direction);
        this.context.drawImage(
            Assets.getInstance().getAsset('ship.svg'),
            x,
            y
        );
        this.context.restore();

        // // Draw health bar
        // context.fillStyle = 'white';
        // context.fillRect(
        //     canvasX - PLAYER_RADIUS,
        //     canvasY + PLAYER_RADIUS + 8,
        //     PLAYER_RADIUS * 2,
        //     2,
        // );
        // context.fillStyle = 'red';
        // context.fillRect(
        //     canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
        //     canvasY + PLAYER_RADIUS + 8,
        //     PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
        //     2,
        // );
    }

    // // Replaces main menu rendering with game rendering.
    public startRendering() {
        clearInterval(this.renderInt);
        this.renderInt = setInterval(this.render.bind(this), 1000 / 60);
    }

    // Replaces game rendering with main menu rendering.
    public stopRendering() {
        clearInterval(this.renderInt);
        this.renderInt = setInterval(this.renderMainMenu.bind(this), 1000 / 60);
    }

    static getInstance() {
        if (!RenderEngine.instance) {
            RenderEngine.instance = new RenderEngine
        }
        return RenderEngine.instance
    }
}
// Get the canvas graphics context

// Renders a ship at the given coordinates
// function 

// function renderBullet(me, bullet) {
//   const { x, y } = bullet;
//   context.drawImage(
//     getAsset('bullet.svg'),
//     canvas.width / 2 + x - me.x - BULLET_RADIUS,
//     canvas.height / 2 + y - me.y - BULLET_RADIUS,
//     BULLET_RADIUS * 2,
//     BULLET_RADIUS * 2,
//   );
// }