/// <reference lib="dom" />

import React, { Line } from "./deps.ts";

type LineProps = Parameters<typeof Line>[0];

export interface GraphProps {
  data: {
    value: { [year: number]: number };
    prefName: string;
  }[];
}

export function Graph(props: GraphProps) {
  console.log("render Graph", props);
  const selectedData = props.data;

  const labelSet = new Set<string>();
  for (const { value } of selectedData) {
    for (const year of Object.keys(value)) {
      labelSet.add(`${year}`);
    }
  }
  const labels = [...labelSet].sort();

  const datasets = selectedData.map(({ prefName, value }) => {
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
    <>
      <div>
        <Line options={options} data={data} height="400" />
      </div>
    </>
  );
}

const colorCache: Record<string, string | undefined> = {};
const encoder = new TextEncoder();
function colorFromString(str: string) {
  if (colorCache[str]) {
    return colorCache[str];
  }
  let n = 1;
  for (const [i, byte] of encoder.encode(str).entries()) {
    n *= byte * 524287 + i * 8191;
    n %= 131071;
  }
  colorCache[str] = `hsl(${n % 360}, 120%, 40%)`;
  return colorCache[str];
}
