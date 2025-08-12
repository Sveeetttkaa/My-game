document.addEventListener('DOMContentLoaded', function() {
    class Player {
        position = {
            x: 0,
            y: 0
        }
        size = {
            width: 100,
            height: 100
        }
        state = 'onLand'
        velocityY = 8
        minJumpHeight = 300
        maxJumpHeight = 500
        update() {

        }
        draw () {
            
        }
    }
    class Obstacle {
        position = {
            x: 100,
            y: 200
        }
        size = {
            width: 50,
            height: 80
        }
        speedX = -8
        update() {
            this.position.x += this.speedX
        }
    }
    class Game {
        constructor() {
            this.player = new Player(); // текущее состояние игрока
            this.obstacles = []; // массив препятствий
            this.time = 0; // время
            this.spawnInterval = 10000; // интервал появления
            this.isRunning = true
        }
    }
})