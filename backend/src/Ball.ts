import { ObjectClass } from './Object'
import * as shortid from 'shortid'
import { Shared } from './shared/Shared'

export class Ball extends ObjectClass {
    constructor(x: number, y: number, dir: number, speed: number = Shared.Constants.BALL_SPEED) {
        super(shortid(), x, y, dir, speed)
    }

    update(dt: number) {
        // change ball trajectory if it hits top or bottom side
        if( this.y <= ( 0 + Shared.Constants.BALL_RADIUS / 2 ) || this.y >= ( Shared.Constants.MAP_SIZE.Y - Shared.Constants.BALL_RADIUS / 2 ) ) {
            // flipping an angle around Y axis is equivalent to reflecting around the X axis ( minus theta ) and then rotating 180° ( plus PI )
            // should rember that reflecting around X axis is just minus theta
            this.direction = Math.PI-this.direction 
        }

        if( this.x <= ( 0 + Shared.Constants.BALL_RADIUS / 2 ) || this.x >= ( Shared.Constants.MAP_SIZE.X - Shared.Constants.BALL_RADIUS / 2 ) ) {
            // flipping an angle around Y axis is equivalent to reflecting around the X axis ( minus theta ) and then rotating 180° ( plus PI )
            // should rember that reflecting around X axis is just minus theta
            this.direction = -this.direction 
        }
        // update position accordingly
        super.update(dt);

        // check if the ball hits either of left or right side and send some signal to the game instance that either player 1 or 2 lost.
    }
}