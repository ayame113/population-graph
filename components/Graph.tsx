/// <reference lib="dom" />

import React, { Line } from "./deps.ts";

type LineProps = Parameters<typeof Line>[0];

export interface GraphProps {
  /** 人口データ */
  data: {
    value: { [year: number]: number };
    prefName: string;
  }[];
}

/** グラフ表示コンポーネント */
export function Graph(props: GraphProps) {
  /** x軸のラベル（year） */
  const labelSet = new Set<string>();
  for (const { value } of props.data) {
    for (const year of Object.keys(value)) {
      labelSet.add(`${year}`);
    }
  }
  const labels = [...labelSet].sort();

  /** グラフに表示するデータ */
  const datasets = props.data.map(({ prefName, value }) => {
    return {
      label: prefName,
      data: labels.map((year) => value[+year]),
      borderColor: colorFromString(prefName),
      backgroundColor: colorFromString(prefName),
    };
  });

  const options: LineProps["options"] = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "都道府県別の人口",
      },
    },
    scales: {
      xAxes: {
        title: { display: true, text: "year" },
      },
      yAxes: {
        title: { display: true, text: "population" },
        beginAtZero: true,
      },
    },
  };

  const data: LineProps["data"] = { labels, datasets };
  return (
    <div
      title={props.data.length
        ? "都道府県総人口グラフ"
        : "表示するデータがありません。上の選択画面から都道府県を選択してください。"}
    >
      <Line options={options} data={data} height="400" />
    </div>
  );
}

const colorCache: Record<string, string | undefined> = {};
const encoder = new TextEncoder();
/** 文字列を元にcss colorを作成して返します。 */
function colorFromString(str: string) {
  // 関数メモ化
  if (colorCache[str]) {
    return colorCache[str];
  }

  let n = 1;
  for (const [i, byte] of encoder.encode(str).entries()) {
    n *= byte * 524287 + i * 8191;
    n %= 131071;
  }

  // 同じ文字列を渡した場合は同じ色が返るのでキャッシュできる
  colorCache[str] = `hsl(${n % 360}, 120%, 40%)`;
  return colorCache[str];
}
