const canvas = document.querySelector('canvas')

const $sprite = document.querySelector('#sprite')
const $bricks = document.querySelector('#bricks')

const ctx = canvas.getContext('2d')

canvas.width = 448
canvas.height = 400

//BALL'S VARIABLE
const ballRadius = 3

//ball's position
let x = canvas.width / 2
let y = canvas.height - 30

//ball's speed
let dx = 2
let dy = -2

// PADDLE'S VARIABLE
const paddleHeight = 10
const paddleWidth = 50

//paddle's position
let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = canvas.height - paddleHeight - 10

let rightPressed = false
let leftPressed = false

const PADDLE_SENSITIVITY = 7

//BRICKS' VARIABLE
const brickRowsCount = 6
const brickColumnsCount = 13
const brickWidth = 32
const brickHeigth = 16
const brickPadding = 0
const brickOffsetTop = 80
const brickOffsetLeft = 16
const bricks = []
const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0
}

for (let c = 0; c < brickColumnsCount; c++) {
  bricks[c] = []
  for (let r = 0; r < brickRowsCount; r++) {
    //calculate position each brick
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
    const brickY = r * (brickHeigth + brickPadding) + brickOffsetTop

    //set a color
    const random = Math.floor(Math.random() * 8)

    //save info bricks
    bricks[c][r] = {
      x: brickX,
      y: brickY,
      status: BRICK_STATUS.ACTIVE,
      color: random
    }
  }
}

function drawBall() {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.closePath()
}

function drawPaddle() {
  ctx.drawImage(
    $sprite, //la imagen
    29, // ClipX: coordenadas de recorte X
    174, //ClipY: coordenadas de recorte Y
    paddleWidth, // Tamaño del recorte
    paddleHeight, // Tamaño del recorte
    paddleX, // posicion de X del dibujo
    paddleY, // posicion de Y del dibujo
    paddleWidth, // ancho del dibujo
    paddleHeight // alto del dibujo
  )
}

function drawBricks() {
  for (let c = 0; c < brickColumnsCount; c++) {
    for (let r = 0; r < brickRowsCount; r++) {
      const currentBrick = bricks[c][r]
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue
      const clipX = currentBrick.color * 32

      ctx.drawImage(
        $bricks,
        clipX,
        0,
        brickWidth,
        brickHeigth,
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHeigth
      )
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnsCount; c++) {
    for (let r = 0; r < brickRowsCount; r++) {
      const currentBrick = bricks[c][r]
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue

      const isBallSameXAsBrick =
        x > currentBrick.x && x < currentBrick.x + brickWidth

      const isBallSameYAsBrick =
        y > currentBrick.y && y < currentBrick.y + brickHeigth
      if (isBallSameXAsBrick && isBallSameYAsBrick) {
        dy = -dy
        currentBrick.status = BRICK_STATUS.DESTROYED
      }
    }
  }
}

function ballMovement() {
  // right wall and left wall
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx
  }

  //up wall
  if (y + dy < ballRadius) {
    dy = -dy
  }

  //paddle
  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth
  const isBallTouchingPaddle = y + dy > paddleY

  if (isBallSameXAsPaddle && isBallTouchingPaddle) {
    dy = -dy
  } else if (y + dy > canvas.height - ballRadius) {
    // game over
    console.log('Game Over')
    document.location.reload()
  }

  x += dx
  y += dy
}

function paddleMovement() {
  if (rightPressed) {
    paddleX += PADDLE_SENSITIVITY
  } else if (leftPressed) {
    paddleX -= PADDLE_SENSITIVITY
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function initEvent() {
  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('keyup', keyUpHandler)

  function keyDownHandler(e) {
    const { key } = e
    if (key === 'Right' || key === 'ArrowRight') {
      rightPressed = true
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = true
    }
  }

  function keyUpHandler(e) {
    const { key } = e
    if (key === 'Right' || key === 'ArrowRight') {
      rightPressed = false
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = false
    }
  }
}

function draw() {
  cleanCanvas()

  //draw elements
  drawBall()
  drawPaddle()
  drawBricks()

  // moves and collisions
  collisionDetection()
  ballMovement()
  paddleMovement()

  window.requestAnimationFrame(draw)
}

draw()
initEvent()
