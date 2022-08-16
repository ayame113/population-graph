/// <reference lib="dom" />
import React, { useState } from "https://esm.sh/react@18.3.0-next-e61fd91f5-20220630/";
import { render } from "https://esm.sh/react-dom@18.3.0-next-e61fd91f5-20220630/";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>hello world {count}</button>
    </div>
  );
}

render(<App />, document.querySelector("#root"));
