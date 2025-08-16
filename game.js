document.addEventListener('DOMContentLoaded', function() {
    let canvas = document.getElementById('gameCanvas') // получила элемент для работы с ним в коде на js
    let ctx = canvas.getContext('2d') // для возможности рисования в браузере, вызывается у элемента canvas и
    // возвращает объект контекста рисования в 2D
    
    function randomBetween(a, b) {
        let s = Math.random() * (b - a) + a
        return s
    }

    function randomSize(a, b) {
        let r = Math.random() * (b - a) + a
        return r
    }

    function drawLine() {
        const groundY = 220;
        ctx.beginPath()
        ctx.moveTo(0, groundY)
        ctx.lineTo(canvas.width, groundY)
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 14
        ctx.stroke()
    }

    class Player { // создаём класс с данными игрока - шарика
        position = { // начальная позиция
            x: 40,
            y: 190
        }
        size = { // размеры
            width: 100,
            height: 100
        }
        state = 'onLand' 
        velocityY = 8
        jumpHeight = 300
        groundPosition = 190
        update(delta) {
            let gravity = 20
            if (this.state === 'inAir') {
                this.velocityY += gravity * (delta/1000)
                this.position.y += this.velocityY * (delta / 1000)
            } 
            if (this.position.y >= this.groundPosition) {
                this.position.y = this.groundPosition
                this.state = 'onLand'
                this.velocityY = 0
            }
        }
        draw (ctx) { 
            ctx.fillStyle = 'purple'
            ctx.beginPath()
            ctx.arc(this.position.x + 40, this.position.y, 30, 0, 2 * Math.PI)
            ctx.fill() 
            ctx.fillStyle = 'white'
            ctx.beginPath()
            ctx.arc(this.position.x + 30, this.position.y - 10, 7, 0, 2 * Math.PI)
            ctx.fill()
            ctx.fillStyle = 'white'
            ctx.beginPath()
            ctx.arc(this.position.x + 50, this.position.y - 10, 7, 0, 2 * Math.PI)
            ctx.fill()
            ctx.fillStyle = 'black'
            ctx.beginPath()
            ctx.arc(this.position.x + 30, this.position.y - 10, 4, 0, 2 * Math.PI)
            ctx.fill()
            ctx.fillStyle = 'black'
            ctx.beginPath()
            ctx.arc(this.position.x + 50, this.position.y - 10, 4, 0, 2 * Math.PI)
            ctx.fill()
            ctx.fillStyle = 'black'
            ctx.beginPath()
            ctx.lineWidth = 1;
            ctx.moveTo(this.position.x + 20, this.position.y + 10)
            ctx.quadraticCurveTo(this.position.x + 40, this.position.y + 25, this.position.x + 60, 
            this.position.y + 10)
            ctx.stroke()
        }
    }
    class Obstacle { // создаём класс с данными препятствия
        constructor () {
            this.size = { // размеры
                width: randomSize(10, 30),
                height: randomSize(60, 120)
            }
            this.groundPosition = 220
            this.position = { 
                x: 1345, 
                y: this.groundPosition - this.size.height 
            }
        }
        speedX = -15 // передвижение по координате x - восемь пикселей влево (это скорость)
        update(delta) {
            this.position.x += this.speedX * (delta / 1000)
        }
        draw(ctx) {
            ctx.fillStyle = 'green' // заливка препятствий
            ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
            // определение позиции и размеров
        }
    }
    class Game {
        constructor(canvas, ctx) { // принимает сам элемент canvas и возможность работать с ним в 2D
            this.canvas = canvas // внутренний canvas - внешний canvas
            this.ctx = ctx // внутренний ctx - внешний ctx
            this.player = new Player(); // текущее состояние игрока
            this.obstacles = []; // массив препятствий
            this.obstacles.push(new Obstacle()); // сразу добавляем, чтобы первое препятствие было без задержки
            this.time = 0; // время
            this.spawnInterval = randomBetween(23000, 40000); // интервал появления препятствий
            this.isRunning = true // проверка на то, идёт ли игра
            this.boundGameLoop = this.gameLoop.bind(this)
            this.lastTime = 0
            this.timeSinceLastSpawn = 0
            this.canvas.addEventListener('click', () => {
                if (this.player.state === 'onLand') {
                    this.player.state = 'inAir'
                    this.player.velocityY = -78 
                }
            })
        }
        clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            // очищаем наш холст 2D по всей ширине и высоте canvas
        }
        gameLoop(timeStamp) { // игровой цикл
            this.clear() // очищаем холст
            drawLine()
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
    requestAnimationFrame(game.boundGameLoop)
})