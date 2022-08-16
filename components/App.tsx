/// <reference lib="dom" />
///
// @deno-types="https://esm.sh/v91/@types/react@18.0.17/index.d.ts"
import React, {
  useState,
} from "https://esm.sh/v91/react@18.2.0/es2022/react.bundle.js";
// @deno-types="https://esm.sh/v91/@types/react-dom@18.0.6/index.d.ts"
import { render } from "https://esm.sh/v91/react-dom@18.2.0/es2022/react-dom.bundle.js";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>hello world {count}</button>
    </div>
  );
}

render(<App />, document.querySelector("#root"));
