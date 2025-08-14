document.addEventListener('DOMContentLoaded', function() {
    let canvas = document.getElementById('gameCanvas')
    let ctx = canvas.getContext('2d')

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
        update(delta) {
            
        }
        draw (ctx) {
            ctx.fillStyle = 'red'
            ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
        }
    }
    class Obstacle {
        position = {
            x: 1345,
            y: 0
        }
        size = {
            width: 10,
            height: 100
        }
        speedX = -8
        update(delta) {
            this.position.x += this.speedX * (delta / 1000)
        }
        draw(ctx) {
            ctx.fillStyle = 'green'
            ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
        }
    }
    class Game {
        constructor(canvas, ctx) {
            this.canvas = canvas
            this.ctx = ctx
            this.player = new Player(); // текущее состояние игрока
            this.obstacles = []; // массив препятствий
            this.obstacles.push(new Obstacle());
            this.time = 0; // время
            this.spawnInterval = 10000; // интервал появления
            this.isRunning = true
            this.boundGameLoop = this.gameLoop.bind(this)
            this.lastTime = 0
            this.timeSinceLastSpawn = 0
        }
        clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
        gameLoop(timeStamp) {
            this.clear()
            this.delta = timeStamp - this.lastTime
            this.lastTime = timeStamp
            this.timeSinceLastSpawn += this.delta
            if (this.timeSinceLastSpawn >= this.spawnInterval) {
                this.obstacles.push(new Obstacle())
                this.timeSinceLastSpawn = 0
            }
            this.player.update(this.delta)
            this.player.draw(this.ctx)
            this.obstacles.forEach(elem => {
                elem.update(this.delta)
                elem.draw(this.ctx)
            })
            this.obstacles = this.obstacles.filter(elem => elem.position.x + elem.size.width >= 0)
            this.time++
            if (this.isRunning) {
                requestAnimationFrame(this.boundGameLoop)
            }
        }
    }
    const game = new Game(canvas, ctx)
    // requestAnimationFrame(game.boundGameLoop)
})