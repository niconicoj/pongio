export class ObjectClass {

    private id: string
    protected x: number
    protected y: number
    protected direction: number
    protected speed: number

    constructor(id: string, x: number, y:number, dir:number, speed: number) {
        this.id = id
        this.x = x
        this.y = y
        this.direction = dir
        this.speed = speed
    }
  
    update(dt: number) {
        this.x += dt * this.speed * Math.sin(this.direction)
        this.y += dt * this.speed * Math.cos(this.direction)
    }
  
    distanceTo(object: ObjectClass) {
        const dx = this.x - object.x
        const dy = this.y - object.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    distanceXTo(object: ObjectClass): number {
        return Math.abs(this.x - object.x)
    }

    distanceYTo(object: ObjectClass): number {
        return Math.abs(this.y - object.y)
    }
  
    public setDirection(dir: number) {
        this.direction = dir;
    }

    public getDirection(): number {
        return this.direction
    }
  
    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
        };
    }
}