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
let direction: Direction = "R";
let interval: any;

function App() {
  const [score, setScore] = useState<number>(0);
  const [map, setMap] = useState<string[] | undefined>(undefined);
  const [snake, setSnake] = useState<SnakePosition>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const createNewGame = () => {
    const initialMap = createNewMap(MAP_WIDTH, MAP_HEIGHT);
    const newSnake = createSnake(DEFAULT_SNAKE_SIZE);
    const newAppleIndex = createRandomApple(MAP_WIDTH, MAP_HEIGHT, newSnake);

    direction = "R";
    clearInterval(interval);

    newSnake.forEach((value) => {
      initialMap[value] = "S";
    });

    initialMap[newAppleIndex] = "X";

    setScore(0);
    setMap(initialMap);
    setSnake(newSnake);
    setGameOver(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.key === "ArrowUp" || e.key === "KeyW") && direction !== "D") {
      direction = "U";
    } else if (
      (e.key === "ArrowDown" || e.key === "KeyS") &&
      direction !== "U"
    ) {
      direction = "D";
    } else if (
      (e.key === "ArrowLeft" || e.key === "KeyA") &&
      direction !== "R"
    ) {
      direction = "L";
    } else if (
      (e.key === "ArrowRight" || e.key === "KeyD") &&
      direction !== "L"
    ) {
      direction = "R";
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
      clearInterval(interval);
      setGameOver(true);

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
    if (!gameOver && map && snake) {
      interval = setInterval(moveSnake, GAME_LOOP);
    } else {
      clearInterval(interval);
    }

    return () => interval && clearInterval(interval);
  }, [map, snake, gameOver]);

  useEffect(() => {
    if (map && snake && !gameOver) {
      window.addEventListener("keydown", onKeyDown);
    } else {
      window.removeEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [map, snake, gameOver]);

  return (
    <div className="App">
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
              cell === "X" && "Map__apple"
            )}
            onClick={() => console.log(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
