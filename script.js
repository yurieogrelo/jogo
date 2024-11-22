const DIREITA = { x: 1, y: 0 };
const ESQUERDA = { x: -1, y: 0 };
const CIMA = { x: 0, y: -1 };
const BAIXO = { x: 0, y: 1 };

const boardSize = 20;

const initialState = {
  snake: [{ x: 0, y: 0 }],
  coffee: generateCoffee(),
  direction: DIREITA,
  gameOver: false,
  score: 0,
};

const board = document.getElementById("board");
const scoreElement = document.getElementById("score");

// Criação das células do tabuleiro
for (let index = 0; index < boardSize * boardSize; index++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  board.appendChild(cell);
}

// Função para desenhar o tabuleiro
const desenhaTabuleiro = (state) => {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => (cell.className = "cell"));

  const [cabeca, ...cauda] = state.snake;
  const index = cabeca.y * boardSize + cabeca.x;
  cells[index].classList.add("snake");

  cauda.forEach((pedaco) => {
    const index = pedaco.y * boardSize + pedaco.x;
    cells[index].classList.add("cauda");
  });

  const coffeeIndex = state.coffee.y * boardSize + state.coffee.x;
  cells[coffeeIndex].classList.add("coffee");

  scoreElement.textContent = `Pontuação: ${state.score}`;
};

// Função para mover a cobrinha
const moveSnake = (snake, direction) => {
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  newHead.x = (newHead.x + boardSize) % boardSize;
  newHead.y = (newHead.y + boardSize) % boardSize;

  return [newHead, ...snake.slice(0, -1)];
};

// Verificar colisão
const checkCollision = (snake) => {
  const [head, ...body] = snake;
  return body.some((segment) => segment.x === head.x && segment.y === head.y);
};

function generateCoffee() {
  return {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  };
}

const gameLoop = (state) => {
  if (state.gameOver) {
    alert("Game over!");
    return;
  }

  const newSnake = moveSnake(state.snake, initialState.direction);
  if (checkCollision(newSnake)) {
    state.gameOver = true;
  }

  let novoCoffee = state.coffee;
  if (newSnake[0].x === state.coffee.x && newSnake[0].y === state.coffee.y) {
    newSnake.push({ ...newSnake[newSnake.length - 1] });
    novoCoffee = generateCoffee();
    const coffeeIndex = novoCoffee.y * boardSize + novoCoffee.x;
    const cells = document.querySelectorAll(".cell");
    cells[coffeeIndex].classList.add("brilho");
    setTimeout(() => {
      cells[coffeeIndex].classList.remove("brilho");
    }, 500);

    state.score += 1;
  }

  const newState = {
    ...state,
    snake: newSnake,
    coffee: novoCoffee,
  };

  desenhaTabuleiro(newState);
  setTimeout(() => gameLoop(newState), 200);
};

// Substituindo os controles de teclado pelos botões de direção
document.getElementById("up").addEventListener("click", () => {
  initialState.direction = CIMA;
});

document.getElementById("down").addEventListener("click", () => {
  initialState.direction = BAIXO;
});

document.getElementById("left").addEventListener("click", () => {
  initialState.direction = ESQUERDA;
});

document.getElementById("right").addEventListener("click", () => {
  initialState.direction = DIREITA;
});

desenhaTabuleiro(initialState);
gameLoop(initialState);
