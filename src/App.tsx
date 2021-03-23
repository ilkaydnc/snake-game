import { useEffect, useState } from "react";
import "./App.css";

const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

const createNewMap = (width: number, height: number): string[] => {
  return new Array(width * height).fill("O");
};

function App() {
  const [map, setMap] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    const emptyMap = createNewMap(MAP_WIDTH, MAP_HEIGHT);

    setMap(emptyMap);
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
            className="Map__cell"
            onClick={() => console.log(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
