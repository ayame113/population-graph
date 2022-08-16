/// <reference lib="dom" />

import React from "./deps.ts";
import type { Prefectures } from "../types.ts";

export interface SelectBoxProps {
  prefectures: Prefectures | null;
  togglePrefecture(prefCode: number): void;
}

export function SelectBox(props: SelectBoxProps) {
  if (!props.prefectures) {
    return <div>loading...</div>;
  }
  return (
    <div>
      {props.prefectures.map((prefecture) => (
        <label>
          <input
            type="checkbox"
            onChange={() => props.togglePrefecture(prefecture.prefCode)}
          />
          {prefecture.prefName}
        </label>
      ))}
    </div>
  );
}
