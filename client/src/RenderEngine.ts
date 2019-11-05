import { debounce } from 'throttle-debounce';
import Assets from './Assets';
//import { getCurrentState } from './state';

import { Shared } from './shared/Shared'
import { Player, Ball } from './types'
import { State } from './state';

export class RenderEngine {

    private static instance: RenderEngine
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private renderInt: number
    //since the game canvas is responsive we have a ratio to scale everything to the correct size
    private static scaleRatio: number

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
        RenderEngine.scaleRatio = width / Shared.Constants.MAP_SIZE.X

    }

    render() {
        let { players, ball } = State.getInstance().getCurrentState();
        // Draw background
        this.renderBackground()

        //   // Draw boundaries
        //   context.strokeStyle = 'black';
        //   context.lineWidth = 1;
        //   // context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

        //   // Draw all bullets
        //   bullets.forEach(renderBullet.bind(null, me));

        // render players
        Object.keys(players).forEach(playerID => {
            this.renderPlayer(players[playerID])
        })
        // render ball

        this.renderBall(ball)


    }

    renderBackground() {
        this.context.fillStyle = '#282832'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderMainMenu() {
        this.renderBackground();
    }

    renderPlayer(player: Player) {
        let { x, y } = player;
        this.context.save();
        let centerX = (x - Shared.Constants.PADDLE.WIDTH / 2) * RenderEngine.scaleRatio
        let centerY = (y - Shared.Constants.PADDLE.HEIGHT / 2) * RenderEngine.scaleRatio
        this.context.drawImage(
            Assets.getInstance().getAsset('paddle.svg'),
            centerX,
            centerY,
            Shared.Constants.PADDLE.WIDTH * RenderEngine.scaleRatio,
            Shared.Constants.PADDLE.HEIGHT * RenderEngine.scaleRatio
        );
        this.context.restore();
    }

    renderBall(ball: Ball) {
        const { x, y } = ball;
        let centerX = (x - Shared.Constants.BALL_RADIUS / 2) * RenderEngine.scaleRatio
        let centerY = (y - Shared.Constants.BALL_RADIUS / 2) * RenderEngine.scaleRatio
        this.context.drawImage(
            Assets.getInstance().getAsset('ball.svg'),
            centerX,
            centerY,
            Shared.Constants.BALL_RADIUS * RenderEngine.scaleRatio,
            Shared.Constants.BALL_RADIUS * RenderEngine.scaleRatio
        );
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

    static getScaleRatio(): number {
        return RenderEngine.scaleRatio
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