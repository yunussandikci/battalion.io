const uuid = require('uuid/v4')


class Shot {

    playerSocketId = null;
    x = 0;
    y = 0;
    ttl = 90;
    angle = 0;

    constructor(playerSocketId, x, y, angle) {
        this.playerSocketId = playerSocketId;
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    updatePosition() {
        this.x += (10*Math.cos(this.angle * Math.PI/180));
        this.y += (10*Math.sin(this.angle * Math.PI/180));
    }

    decreaseTtl() {
        this.ttl--;
    }

    isAlive() {
        return this.ttl > 0;
    }
}

class ShotManager {

    constructor() {
        this.shots = {}
    }

    getShot(uuid) {
        return this.shots[uuid]
    }

    newShot(socketId, x, y, angle) {
        this.shots[uuid().replace(/-/g,"").substr(0,16)] = new Shot(socketId, x, y, angle)
    }
    removeShot(uuid) {
        delete this.shots[uuid]
    }

    update() {
        for(let key in this.shots){
            let shot = this.shots[key];
            shot.updatePosition()
            shot.decreaseTtl()
            if(!shot.isAlive()) {
                delete this.shots[key];
            }
        }
    }

}

module.exports.ShotManager = ShotManager