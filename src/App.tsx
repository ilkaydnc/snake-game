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

const DEFAULT_SNAKE_SIZE = 3;
let interval: any;

function App() {
  const [mapWidth, setMapWidth] = useState<number>(24);
  const [mapHeight, setMapHeight] = useState<number>(24);
  const [gameInterval, setGameInterval] = useState<number>(50);

  const [score, setScore] = useState<number>(0);
  const [map, setMap] = useState<string[] | undefined>(undefined);
  const [snake, setSnake] = useState<SnakePosition>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("R");
  const [errorCellIndex, setErrorCellIndex] = useState<number | undefined>(
    undefined
  );

  const createNewGame = () => {
    const initialMap = createNewMap(mapWidth, mapHeight);
    const newSnake = createSnake(DEFAULT_SNAKE_SIZE);
    const newAppleIndex = createRandomApple(mapWidth, mapHeight, newSnake);

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
    setGameStarted(true);
    setGameOver(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" && gameOver) {
      setGameOver(false);
      setGameStarted(false);
      return;
    }

    if (e.code === "ArrowUp" && direction !== "D") {
      clearInterval(interval);
      setDirection("U");
    } else if (e.code === "ArrowDown" && direction !== "U") {
      clearInterval(interval);
      setDirection("D");
    } else if (e.code === "ArrowLeft" && direction !== "R") {
      clearInterval(interval);
      setDirection("L");
    } else if (e.code === "ArrowRight" && direction !== "L") {
      clearInterval(interval);
      setDirection("R");
    }
  };

  const moveSnake = () => {
    if (!map && !snake) return null;

    const snakeHead = snake[snake.length - 1];
    const nextPosition = getNextPosition(snakeHead, mapWidth, direction);

    if (
      // Left Wall
      (snakeHead % mapWidth === 0 && direction === "L") ||
      // Right Wall
      (snakeHead % mapWidth === mapWidth - 1 && direction === "R") ||
      // Top Wall
      nextPosition < 0 ||
      // Bottom Wall
      nextPosition > mapWidth * mapHeight ||
      // Snake Collision
      snake.includes(nextPosition)
    ) {
      setErrorCellIndex(
        snake.includes(nextPosition) ? nextPosition : snakeHead
      );
      clearInterval(interval);

      setTimeout(() => {
        setGameOver(true);
      }, 1000);

      return null;
    }

    const cloneSnake = Array.from(snake);
    const cloneMap = Array.from(map || []);

    cloneSnake.push(nextPosition);

    if (cloneMap[nextPosition] === "X") {
      cloneMap[nextPosition] = "O";

      const newAppleIndex = createRandomApple(mapWidth, mapHeight, cloneSnake);

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
    if (map && snake && !errorCellIndex) {
      interval = setInterval(moveSnake, gameInterval);
    }

    return () => interval && clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, snake, direction, errorCellIndex]);

  useEffect(() => {
    if (map && snake) {
      window.addEventListener("keydown", onKeyDown);
    } else {
      window.removeEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, snake, gameOver]);

  return (
    <div className="App">
      {!gameStarted && (
        <div className="NewGame">
          <div className="NewGame__select">
            <label htmlFor="difficulty">Game Difficulty</label>
            <select
              name="difficulty"
              id="difficulty"
              value={gameInterval}
              onChange={(e) => setGameInterval(+e.target.value)}
            >
              <option value="100">Easy</option>
              <option value="50">Normal</option>
              <option value="25">Hard</option>
              <option value="10">???</option>
            </select>
          </div>
          <div className="NewGame__select">
            <label htmlFor="size">Map Size</label>
            <select
              name="size"
              id="size"
              value={mapWidth}
              onChange={(e) => {
                setMapWidth(+e.target.value);
                setMapHeight(+e.target.value);
              }}
            >
              <option value="16">16x16</option>
              <option value="24">24x24</option>
              <option value="32">32x32</option>
            </select>
          </div>
          <button className="NewGame__button" onClick={createNewGame}>
            Start Game
          </button>
        </div>
      )}
      {!gameOver && gameStarted && (
        <div className="ScoreTable">
          <h2>Score: {score}</h2>
        </div>
      )}
      {gameOver ? (
        <div
          className="GameOver"
          style={{ width: mapWidth * 24, height: mapHeight * 24 }}
        >
          <h1 className="GameOver__title">Game Over</h1>

          <span className="GameOver__score">Your Score: {score}</span>
          <button
            className="GameOver__button"
            onClick={() => {
              setGameOver(false);
              setGameStarted(false);
            }}
          >
            Return Main Menu <code>[Space]</code>
          </button>
        </div>
      ) : (
        gameStarted && (
          <div
            className="Map"
            style={{
              gridTemplateColumns: `repeat(${mapWidth}, 24px)`,
              gridAutoRows: `repeat(${mapHeight}, 24px)`,
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
        )
      )}
    </div>
  );
}

export default App;
