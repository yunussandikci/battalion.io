const PlayerManager = require('./PlayerManager')
const ShotManager = require('./ShotManager')

class GameManager {

    playerManager = new PlayerManager.PlayerManager();
    shotManager = new ShotManager.ShotManager();

    newPlayer(socketId) {
        this.playerManager.newPlayer(socketId);
    }

    setPlayerName(socketId, name) {
        this.playerManager.getPlayer(socketId).setName(name);
    }

    removePlayer(socketId) {
        this.playerManager.removePlayer(socketId);
    }

    setPlayerAngle(socketId, angle) {
        const player = this.playerManager.getPlayer(socketId);
        if(angle > 360){
            player.setStopped(true)
        } else {
            player.setStopped(false)
            player.setAngle(angle)
        }
    }

    newShot(socketId) {
        const player = this.playerManager.getPlayer(socketId);
        if (player.canShot()) {
            player.updateLastShot()
            this.shotManager.newShot(socketId, player.x, player.y, player.angle)
        }
    }

        getUpdateForSocket(socketId) {
        return JSON.stringify({
            players: this.playerManager.players,
            shots: this.shotManager.shots,
            currentUser: {socketId: socketId}
        })
    }

    checkCollision() {
        for (let playerKey in this.playerManager.players) {
            var curentPlayer = this.playerManager.getPlayer(playerKey)
            for (let shotKey in this.shotManager.shots) {
                var currentShot = this.shotManager.getShot(shotKey)
                if (playerKey !== currentShot.playerSocketId) {
                    var distanceFromShotToPlayer = Math.sqrt((Math.pow(curentPlayer.x - currentShot.x, 2)) + (Math.pow(curentPlayer.y - currentShot.y, 2)))
                    if (distanceFromShotToPlayer < 20) {
                        this.shotManager.removeShot(shotKey)
                        curentPlayer.decreaseHealth();
                        if (curentPlayer.isDead()) {
                            curentPlayer.refresh();
                            this.playerManager.getPlayer(currentShot.playerSocketId).increaseLevel()
                        }
                    }
                }
            }
        }
    }

    update() {
        this.playerManager.update()
        this.shotManager.update()
        this.checkCollision()
    }

}

module.exports.GameManager = GameManager