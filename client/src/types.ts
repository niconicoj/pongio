export type Player = {
    direction: number; 
    id: string; 
    speed: number; 
    username: string; 
    x:number; 
    y:number
}

export type Ball = {
    direction: number;
    speed: number;
    x: number;
    y: number;
}

export type Update = {
    players: {[key: string]: Player}
    ball: Ball
    t: number
}

export type ObjectType = {
    direction: number;
    speed: number;
    x: number;
    y: number;
}

export type StateObject = {
    players: {
        [key: string]: Player;
    };
    ball: ObjectType;
}