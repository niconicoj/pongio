import { RenderEngine } from "./RenderEngine";
import Networking from "./networking";

// import { updateDirection } from './networking';

export class Input {

    private static instance: Input
    private canvas: HTMLCanvasElement

    constructor() {
        // this.startCapturingInput()
    }

    public startCapturingInput() {
        this.canvas = <HTMLCanvasElement> document.getElementById('game-canvas')

        window.addEventListener('resize', this.handleResize)
        this.canvas.addEventListener('mousemove', this.onMouseInput.bind(this))
        // window.addEventListener('click', onMouseInput);
        // window.addEventListener('touchstart', onTouchInput);
        // window.addEventListener('touchmove', onTouchInput);
    }

    onMouseInput(e: MouseEvent) {
        this.handleInput(e.clientX, e.clientY)
    }

    handleInput(x: number, y: number) {
        var rect = this.canvas.getBoundingClientRect()
        let  canvasX = x - rect.left
        let  canvasY = y - rect.top
        console.log('mouse x : ',canvasX - rect.width / 2)
        console.log('mouse y : ',rect.height / 2 - canvasY)
        const dir = Math.atan2(canvasX - rect.width / 2, canvasY + rect.height / 2 )
        Networking.getInstance().updateDirection(dir, Networking.getInstance().getChannel)
    }

    handleResize(e: UIEvent) {
        RenderEngine.getInstance().setCanvasDimensions()
    }

    static getInstance() {
        if (!Input.instance) {
            Input.instance = new Input
        }
        return Input.instance
    }
}

// function onTouchInput(e: TouchEvent) {
//   const touch = e.touches[0];
//   handleInput(touch.clientX, touch.clientY);
// }

// export function startCapturingInput() {
//     window.addEventListener('resize', this.handleResize)
//   // window.addEventListener('mousemove', onMouseInput);
//   // window.addEventListener('click', onMouseInput);
//   // window.addEventListener('touchstart', onTouchInput);
//   // window.addEventListener('touchmove', onTouchInput);
// }

// export function stopCapturingInput() {
//   window.removeEventListener('mousemove', onMouseInput);
//   window.removeEventListener('click', onMouseInput);
//   window.removeEventListener('touchstart', onTouchInput);
//   window.removeEventListener('touchmove', onTouchInput);
// }