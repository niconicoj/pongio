import { RenderEngine } from "./RenderEngine";

// import { updateDirection } from './networking';

export class Input {

    private static instance: Input

    constructor() {
        // this.startCapturingInput()
    }

    public startCapturingInput() {
        window.addEventListener('resize', this.handleResize)
      // window.addEventListener('mousemove', onMouseInput);
      // window.addEventListener('click', onMouseInput);
      // window.addEventListener('touchstart', onTouchInput);
      // window.addEventListener('touchmove', onTouchInput);
    }

    handleResize(e: UIEvent) {
        RenderEngine.getInstance().setCanvasDimensions()
    }

    static getInstance() {
        if(!Input.instance){
            Input.instance = new Input
        }
        return Input.instance
    }
}

// function onMouseInput(e: MouseEvent) {
//   handleInput(e.clientX, e.clientY);
// }

// function onTouchInput(e: TouchEvent) {
//   const touch = e.touches[0];
//   handleInput(touch.clientX, touch.clientY);
// }

// function handleInput(x: number, y: number) {
//   const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
//   updateDirection(dir);
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