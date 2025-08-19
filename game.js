document.addEventListener('DOMContentLoaded', function() {
    let canvas = document.getElementById('gameCanvas') 
    let ctx = canvas.getContext('2d') 
    let tryAgain = document.getElementById('again')

    tryAgain.addEventListener('click', function () {
        game.obstacles = []
        game.obstacles.push(new Obstacle()); // сразу добавляем, чтобы первое препятствие было без задержки
        game.time = 0; // время
        game.lastTime = 0
        game.timeSinceLastSpawn = 0
        game.groundOffsetX = 0
        game.isRunning = true
        game.gameOver = false
        requestAnimationFrame(game.boundGameLoop)
        tryAgain.style.display = "none"
    })

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            game.isRunning = false
        } else if (document.visibilityState === 'visible') {
            if (!game.isSuccess) {
                game.isRunning = true
                requestAnimationFrame(game.boundGameLoop)
            }
        }
    });

    function randomBetween(a, b) {
        let s = Math.random() * (b - a) + a
        return s
    }

    function randomSize(a, b) {
        let r = Math.random() * (b - a) + a
        return r
    }

    function formatHHMMSS(totalSeconds) {
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (num) => num.toString().padStart(2, '0');

        return `${pad(minutes)}:${pad(seconds)}`
    }

    function drawLine(groundOffsetX) {
        const groundY = 220;
        ctx.beginPath()
        ctx.moveTo(groundOffsetX, groundY)
        ctx.lineTo(groundOffsetX + 2 * canvas.width, groundY)
        ctx.lineWidth = 14
        ctx.strokeStyle = 'black'
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
            let gravity = 500
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
            ctx.fillStyle = '#ffa500'
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
        speedX = -200 // передвижение по координате x - восемь пикселей влево (это скорость)
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
            this.spawnInterval = randomBetween(2000, 5000); // интервал появления препятствий
            this.isRunning = true // проверка на то, идёт ли игра
            this.isSuccess = false
            this.boundGameLoop = this.gameLoop.bind(this)
            this.lastTime = 0
            this.timeSinceLastSpawn = 0
            this.groundOffsetX = 0
            this.gameOver = false
            this.canvas.addEventListener('click', () => {
                if (this.player.state === 'onLand') {
                    this.player.state = 'inAir'
                    this.player.velocityY = -400
                }
            })
        }
        clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            // очищаем наш холст 2D по всей ширине и высоте canvas
        }
        gameLoop(timeStamp) { // игровой цикл
            try {
                if (this.gameOver) return;
                this.delta = Math.min(timeStamp - this.lastTime, 100);
                this.lastTime = timeStamp
                this.groundOffsetX += -65 * (this.delta/1000)
                if (this.groundOffsetX <= -this.canvas.width) {
                    this.groundOffsetX = 0
                }
                this.clear() // очищаем холст
                drawLine(this.groundOffsetX)
                this.timeSinceLastSpawn += this.delta
                if (this.timeSinceLastSpawn >= this.spawnInterval) {
                    this.obstacles.push(new Obstacle())
                    this.timeSinceLastSpawn = 0
                    this.spawnInterval = randomBetween(2000, 10000);
                }
                this.player.update(this.delta)
                this.player.draw(this.ctx)
                this.obstacles.forEach(elem => {
                    elem.update(this.delta)
                    elem.draw(this.ctx)
                })
                this.obstacles.forEach(elem => {
                    if ((elem.position.x + elem.size.width) > this.player.position.x + 40 - 30 && 
                    elem.position.x < (this.player.position.x + 40 - 30 + 58) && 
                    (elem.position.y + elem.size.height) > this.player.position.y - 30 && 
                    elem.position.y < (this.player.position.y - 30 + 52)) {
                        throw new Error('Игра окончена')
                    }
                })
                this.obstacles = this.obstacles.filter(elem => elem.position.x + elem.size.width >= 0)
                this.time += this.delta
                const totalSeconds = Math.floor(this.time/1000)
                const formatedTime = formatHHMMSS(totalSeconds)
                ctx.font = "18px Arial";
                ctx.fillStyle = "black";
                ctx.fillText(formatedTime, 1280, 35)
                if (this.time >= 1800000 && !this.isSuccess) {
                    this.isSuccess = true
                    throw new Error('Ты выиграл - молодец!')
                }
                if (this.isRunning) {
                    requestAnimationFrame(this.boundGameLoop)
                }
            } catch (err) {
                this.isRunning = false
                alert(err.message)
                tryAgain.style.display = 'block'
            }
        }
    }
    const game = new Game(canvas, ctx)
    requestAnimationFrame(game.boundGameLoop)
})



