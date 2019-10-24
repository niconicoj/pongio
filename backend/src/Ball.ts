import { ObjectClass } from './Object'
import * as shortid from 'shortid'
import { Shared } from './shared/Shared'

export class Ball extends ObjectClass {
    constructor(x: number, y: number, dir: number) {
        super(shortid(), x,y,dir,Shared.Constants.BALL_SPEED)
    }
}