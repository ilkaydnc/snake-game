import { useEffect, useState } from "react";
import cs from "classnames";
import "./App.css";

type Direction = "R" | "L" | "U" | "D";
type SnakePosition = number[];

const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;
const DEFAULT_SNAKE_SIZE = 3;
let GAME_LOOP = 300;

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

function App() {
  const [map, setMap] = useState<string[] | undefined>(undefined);
  const [snake, setSnake] = useState<SnakePosition>([]);
  const [direction, setDirection] = useState<Direction>("R");
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    const initialMap = createNewMap(MAP_WIDTH, MAP_HEIGHT);
    const newSnake = createSnake(DEFAULT_SNAKE_SIZE);
    const newAppleIndex = createRandomApple(MAP_WIDTH, MAP_HEIGHT, newSnake);

    newSnake.forEach((value) => {
      initialMap[value] = "S";
    });

    initialMap[newAppleIndex] = "X";

    setMap(initialMap);
    setSnake(newSnake);
  }, []);

  useEffect(() => {
    let interval: any;

    if (!gameOver && map && snake) {
      interval = setInterval(() => {
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
        const cloneMap = Array.from(map);

        cloneSnake.push(nextPosition);

        if (map[nextPosition] === "X") {
          cloneMap[nextPosition] = "O";

          const newAppleIndex = createRandomApple(
            MAP_WIDTH,
            MAP_HEIGHT,
            cloneSnake
          );

          cloneMap[newAppleIndex] = "X";

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
      }, GAME_LOOP);
    } else {
      clearInterval(interval);
    }

    return () => interval && clearInterval(interval);
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
