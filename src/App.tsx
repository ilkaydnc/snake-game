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

function App() {
  const [map, setMap] = useState<string[] | undefined>(undefined);
  const [snake, setSnake] = useState<number[] | undefined>([]);

  useEffect(() => {
    const emptyMap = createNewMap(MAP_WIDTH, MAP_HEIGHT);
    const newSnake = createSnake(DEFAULT_SNAKE_SIZE);

    newSnake.forEach((value) => {
      emptyMap[value] = "S";
    });

    setMap(emptyMap);
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
            className={cs("Map__cell", cell === "S" && "Map__snake")}
            onClick={() => console.log(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
