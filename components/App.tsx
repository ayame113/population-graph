/// <reference lib="dom" />
import React, { useState } from "https://esm.sh/react@17.0.2";
import { render } from "https://esm.sh/react-dom@17.0.2";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>hello world {count}</button>
    </div>
  );
}

render(<App />, document.querySelector("#root"));
