// The "current" state will always be RENDER_DELAY ms behind server time.
// This makes gameplay smoother and lag less noticeable.

import { Shared } from './shared/Shared'
import { Player, Update } from './types'

export class State {

    private static instance: State
    private gameUpdates: Array<Update>
    private gameStart = 0
    private firstServerTimestamp = 0

    private constructor() {
        this.initState()
    }

    initState() {
        this.gameStart = 0
        this.firstServerTimestamp = 0
        this.gameUpdates = []
    }

    processGameUpdate(update: Update) {
        if (!this.firstServerTimestamp) {
            this.firstServerTimestamp = update.t
            this.gameStart = Date.now()
        }
        this.gameUpdates.push(update)

        // Keep only one game update before the current server time
        const base = this.getBaseUpdate();
        if (base > 0) {
            this.gameUpdates.splice(0, base);
        }
    }

    getBaseUpdate() {
        const serverTime = this.currentServerTime();
        for (let i = this.gameUpdates.length - 1; i >= 0; i--) {
            if (this.gameUpdates[i].t <= serverTime) {
                return i;
            }
        }
        return -1;
    }

    currentServerTime() {
        return this.firstServerTimestamp + (Date.now() - this.gameStart) - Shared.Constants.RENDER_DELAY;
    }

    getCurrentState() {
        if (!this.firstServerTimestamp) {
            return {};
        }

        const base = this.getBaseUpdate();
        const serverTime = this.currentServerTime();

        // If base is the most recent update we have, use its state.
        // Otherwise, interpolate between its state and the state of (base + 1).
        if (base < 0 || base === this.gameUpdates.length - 1) {
            return this.gameUpdates[this.gameUpdates.length - 1];
        } else {
            const baseUpdate = this.gameUpdates[base];
            const next = this.gameUpdates[base + 1];
            const ratio = (serverTime - baseUpdate.t) / (next.t - baseUpdate.t);
            return {
                players: baseUpdate.players,
                ball: baseUpdate.ball,
            };
        }
    }

    interpolateObject(object1: { [x: string]: number; }, object2: { [x: string]: number; }, ratio: number) {
        if (!object2) {
            return object1;
        }

        const interpolated = {};
        Object.keys(object1).forEach(key => {
            if (key === 'direction') {
                interpolated[key] = this.interpolateDirection(object1[key], object2[key], ratio);
            } else {
                interpolated[key] = object1[key] + (object2[key] - object1[key]) * ratio;
            }
        });
        return interpolated;
    }

    interpolateObjectArray(objects1: { map: (arg0: (o: any) => any) => void; }, objects2: { find: (arg0: (o2: any) => boolean) => void; }, ratio: any) {
        return objects1.map((o: { id: any; }) => this.interpolateObject(o, objects2.find((o2: { id: any; }) => o.id === o2.id), ratio));
    }

    // Determines the best way to rotate (cw or ccw) when interpolating a direction.
    // For example, when rotating from -3 radians to +3 radians, we should really rotate from
    // -3 radians to +3 - 2pi radians.
    interpolateDirection(d1: number, d2: number, ratio: number) {
        const absD = Math.abs(d2 - d1);
        if (absD >= Math.PI) {
            // The angle between the directions is large - we should rotate the other way
            if (d1 > d2) {
                return d1 + (d2 + 2 * Math.PI - d1) * ratio;
            } else {
                return d1 - (d2 - 2 * Math.PI - d1) * ratio;
            }
        } else {
            // Normal interp
            return d1 + (d2 - d1) * ratio;
        }
    }


    static getInstance() {
        if (!State.instance) {
            State.instance = new State
        }
        return State.instance
    }
}

// export function processGameUpdate(update) {
//   if (!firstServerTimestamp) {
//     firstServerTimestamp = update.t;
//     gameStart = Date.now();
//   }
//   gameUpdates.push(update);

//   updateLeaderboard(update.leaderboard);

//   // Keep only one game update before the current server time
//   const base = getBaseUpdate();
//   if (base > 0) {
//     gameUpdates.splice(0, base);
//   }
// }

// // Returns the index of the base update, the first game update before
// // current server time, or -1 if N/A.
// function getBaseUpdate() {
//   const serverTime = currentServerTime();
//   for (let i = gameUpdates.length - 1; i >= 0; i--) {
//     if (gameUpdates[i].t <= serverTime) {
//       return i;
//     }
//   }
//   return -1;
// }

// // Returns { me, others, bullets }
// export function getCurrentState() {
//   if (!firstServerTimestamp) {
//     return {};
//   }

//   const base = getBaseUpdate();
//   const serverTime = currentServerTime();

//   // If base is the most recent update we have, use its state.
//   // Otherwise, interpolate between its state and the state of (base + 1).
//   if (base < 0 || base === gameUpdates.length - 1) {
//     return gameUpdates[gameUpdates.length - 1];
//   } else {
//     const baseUpdate = gameUpdates[base];
//     const next = gameUpdates[base + 1];
//     const ratio = (serverTime - baseUpdate.t) / (next.t - baseUpdate.t);
//     return {
//       me: interpolateObject(baseUpdate.me, next.me, ratio),
//       others: interpolateObjectArray(baseUpdate.others, next.others, ratio),
//       bullets: interpolateObjectArray(baseUpdate.bullets, next.bullets, ratio),
//     };
//   }
// }

// function interpolateObject(object1, object2, ratio) {
//   if (!object2) {
//     return object1;
//   }

//   const interpolated = {};
//   Object.keys(object1).forEach(key => {
//     if (key === 'direction') {
//       interpolated[key] = interpolateDirection(object1[key], object2[key], ratio);
//     } else {
//       interpolated[key] = object1[key] + (object2[key] - object1[key]) * ratio;
//     }
//   });
//   return interpolated;
// }

// function interpolateObjectArray(objects1, objects2, ratio) {
//   return objects1.map(o => interpolateObject(o, objects2.find(o2 => o.id === o2.id), ratio));
// }

// // Determines the best way to rotate (cw or ccw) when interpolating a direction.
// // For example, when rotating from -3 radians to +3 radians, we should really rotate from
// // -3 radians to +3 - 2pi radians.
