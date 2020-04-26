const MAX_MAPSIZE = 800;

class Player {
    name = "";
    x = 0;
    y = 0;
    angle = 1000;
    lastShot = new Date()
    health = 100;
    level = 1;
    stopped = true;

    setName(name) {
        this.name = name;
    }

    setAngle(data) {
        this.angle = Number(data);
    }

    decreaseHealth() {
        this.health -= 10;
    }

    increaseLevel() {
        this.level++;
    }

    setStopped(data) {
        this.stopped = data;
    }

    isDead() {
        return this.health <= 0;
    }

    canShot() {
        return this.lastShot.getTime() / 1000 + 0.1 < new Date().getTime() / 1000;
    }

    updateLastShot() {
        this.lastShot = new Date();
    }

    refresh() {
        this.x = 0;
        this.y = 0;
        this.health = 100;
        this.stopped = true;
        this.level = 1;
    }

    updatePosition() {
        let velocityX = 0;
        let velocityY = 0;

        if (!this.stopped) {
            velocityX = (Math.cos(this.angle * Math.PI / 180)) * 3;
            velocityY = (Math.sin(this.angle * Math.PI / 180)) * 3;
            if (velocityX > 0 && velocityX + this.x > MAX_MAPSIZE) {
                this.x = MAX_MAPSIZE;
            } else if (velocityX < 0 && velocityX + this.x < -MAX_MAPSIZE) {
                this.x = -MAX_MAPSIZE;
            } else {
                this.x = this.x + velocityX;
            }
            if (velocityY > 0 && velocityY + this.y > MAX_MAPSIZE) {
                this.y = MAX_MAPSIZE;
            } else if (velocityY < 0 && velocityY + this.y < -MAX_MAPSIZE) {
                this.y = -MAX_MAPSIZE;
            } else {
                this.y = this.y + velocityY;
            }
        }

    }

}

class PlayerManager {
    constructor() {
        this.players = {}
    }

    getPlayer(socketId) {
        return this.players[socketId]
    }

    newPlayer(socketId) {
        const newPlayer = new Player();
        this.players[socketId] = newPlayer
        return newPlayer;
    }

    removePlayer(socketId) {
        delete this.players[socketId]
    }

    update() {
        for (let key in this.players) {
            this.players[key].updatePosition()
        }
    }

}

module.exports.PlayerManager = PlayerManager