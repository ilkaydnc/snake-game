import { useEffect, useState } from "react";
import cs from "classnames";
import "./App.css";

type Direction = "R" | "L" | "U" | "D";
type SnakePosition = number[];

const createNewMap = (width: number, height: number): string[] => {
  return new Array(width * height).fill("O");
};

const createSnake = (size: number): SnakePosition => {
  return new Array(size).fill(0).map((_, i) => i);
};

const createRandomApple = (
  width: number,
  height: number,
  snake: number[]
): number => {
  const maxIndex = width * height;
  let selected = Math.floor(Math.random() * maxIndex);

  while (snake.includes(selected)) {
    selected = Math.floor(Math.random() * maxIndex);
  }

  return selected;
};

const getNextPosition = (
  snakeHead: number,
  width: number,
  direction: Direction
): number => {
  switch (direction) {
    case "L":
      return snakeHead - 1;
    case "R":
      return snakeHead + 1;
    case "U":
      return snakeHead - width;
    case "D":
      return snakeHead + width;

    default:
      return snakeHead;
  }
};

const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;
const DEFAULT_SNAKE_SIZE = 3;
let GAME_LOOP = 50;
let interval: any;

function App() {
  const [score, setScore] = useState<number>(0);
  const [map, setMap] = useState<string[] | undefined>(undefined);
  const [snake, setSnake] = useState<SnakePosition>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("R");
  const [errorCellIndex, setErrorCellIndex] = useState<number | undefined>(
    undefined
  );

  const createNewGame = () => {
    const initialMap = createNewMap(MAP_WIDTH, MAP_HEIGHT);
    const newSnake = createSnake(DEFAULT_SNAKE_SIZE);
    const newAppleIndex = createRandomApple(MAP_WIDTH, MAP_HEIGHT, newSnake);

    setDirection("R");
    clearInterval(interval);

    newSnake.forEach((value) => {
      initialMap[value] = "S";
    });

    initialMap[newAppleIndex] = "X";

    setErrorCellIndex(undefined);
    setScore(0);
    setMap(initialMap);
    setSnake(newSnake);
    setGameOver(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" && gameOver) {
      createNewGame();
      return;
    }

    if (e.code === "ArrowUp" && ["L", "R"].includes(direction)) {
      setDirection("U");
    } else if (e.code === "ArrowDown" && ["L", "R"].includes(direction)) {
      setDirection("D");
    } else if (e.code === "ArrowLeft" && ["U", "D"].includes(direction)) {
      setDirection("L");
    } else if (e.code === "ArrowRight" && ["U", "D"].includes(direction)) {
      setDirection("R");
    }

  };

  const moveSnake = () => {
    if (!map && !snake) return null;

    const snakeHead = snake[snake.length - 1];
    const nextPosition = getNextPosition(snakeHead, MAP_WIDTH, direction);

    if (
      // Left Wall
      (snakeHead % MAP_WIDTH === 0 && direction === "L") ||
      // Right Wall
      (snakeHead % MAP_WIDTH === MAP_WIDTH - 1 && direction === "R") ||
      // Top Wall
      nextPosition < 0 ||
      // Bottom Wall
      nextPosition > MAP_WIDTH * MAP_HEIGHT ||
      // Snake Collision
      snake.includes(nextPosition)
    ) {
      setErrorCellIndex(
        snake.includes(nextPosition) ? nextPosition : snakeHead
      );
      clearInterval(interval);

      setTimeout(() => {
        setGameOver(true);
      }, 2000);

      return null;
    }

    const cloneSnake = Array.from(snake);
    const cloneMap = Array.from(map || []);

    cloneSnake.push(nextPosition);

    if (cloneMap[nextPosition] === "X") {
      cloneMap[nextPosition] = "O";

      const newAppleIndex = createRandomApple(
        MAP_WIDTH,
        MAP_HEIGHT,
        cloneSnake
      );

      cloneMap[newAppleIndex] = "X";

      setScore((prevScore) => prevScore + 1);

      setSnake(cloneSnake);
      setMap(cloneMap);

      return null;
    }

    cloneSnake.shift();

    snake.forEach((value) => {
      cloneMap[value] = "O";
    });

    cloneSnake.forEach((value) => {
      cloneMap[value] = "S";
    });

    setSnake(cloneSnake);
    setMap(cloneMap);
  };

  useEffect(() => {
    createNewGame();
  }, []);

  useEffect(() => {
    clearInterval(interval);

    if (!gameOver && map && snake) {
      interval = setInterval(moveSnake, GAME_LOOP);
    }

    return () => interval && clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, snake, gameOver, direction]);

  useEffect(() => {
    if (map && snake) {
      window.addEventListener("keydown", onKeyDown);
    } else {
      window.removeEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [map, snake, gameOver]);

  return (
    <div className="App">
      {!gameOver && (
        <div className="ScoreTable">
          <h2>Score: {score}</h2>
        </div>
      )}
      {gameOver ? (
        <div
          className="GameOver"
          style={{ width: MAP_WIDTH * 24, height: MAP_HEIGHT * 24 }}
        >
          <h1 className="GameOver__title">Game Over</h1>

          <span className="GameOver__score">Your Score: {score}</span>
          <button className="GameOver__button" onClick={createNewGame}>
            Press <code>[Space]</code> to Start New Game!
          </button>
        </div>
      ) : (
        <div
          className="Map"
          style={{
            gridTemplateColumns: `repeat(${MAP_WIDTH}, 24px)`,
            gridAutoRows: `repeat(${MAP_HEIGHT}, 24px)`,
          }}
        >
          {map?.map((cell, index) => (
            <div
              key={index}
              className={cs(
                "Map__cell",
                cell === "S" && "Map__snake",
                snake[snake.length - 1] === index && "Map__snake_head",
                cell === "X" && "Map__apple",
                errorCellIndex === index && "Map__error_cell"
              )}
              onClick={() => console.log(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
