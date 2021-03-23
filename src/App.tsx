import { useEffect, useState } from "react";
import cs from "classnames";
import "./App.css";

const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;
const DEFAULT_SNAKE_SIZE = 3;

const createNewMap = (width: number, height: number): string[] => {
  return new Array(width * height).fill("O");
};

const createSnake = (size: number): number[] => {
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

function App() {
  const [map, setMap] = useState<string[] | undefined>(undefined);
  const [snake, setSnake] = useState<number[] | undefined>([]);

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
