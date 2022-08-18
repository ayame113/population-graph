// @deno-types="https://esm.sh/v91/@types/react@18.0.17/index.d.ts"
export { default } from "https://esm.sh/v91/react@18.2.0/es2020/react.js";
export {
  memo,
  useCallback,
  useState,
} from "https://esm.sh/v91/react@18.2.0/es2020/react.js";

// @deno-types="https://esm.sh/v91/@types/react-dom@18.0.6/index.d.ts"
export { render } from "https://esm.sh/v91/react-dom@18.2.0/es2020/react-dom.js";

// @deno-types="https://esm.sh/v91/react-chartjs-2@4.3.1/dist/index.d.ts"
export { Line } from "https://esm.sh/v91/react-chartjs-2@4.3.1/es2020/react-chartjs-2.js";

// @deno-types="https://esm.sh/v91/chart.js@3.9.1/types/index.esm.d.ts"
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "https://esm.sh/v91/chart.js@3.9.1/es2020/chart.js";

// ChartJSを初期化
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
