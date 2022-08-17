/// <reference lib="dom" />

import React, { memo } from "./deps.ts";
import type { Prefectures } from "../types.ts";

export interface SelectBoxProps {
  prefectures: Prefectures;
  togglePrefecture(prefCode: number): void;
}

export const SelectBox = memo(_SelectBox);
function _SelectBox(props: SelectBoxProps) {
  if (!props.prefectures) {
    return <div>loading...</div>;
  }
  return (
    <div className="select-box">
      {props.prefectures.map((prefecture) => (
        <>
          <input
            id={`select-box-${prefecture.prefCode}`}
            type="checkbox"
            onChange={() => props.togglePrefecture(prefecture.prefCode)}
          />
          <label htmlFor={`select-box-${prefecture.prefCode}`}>
            {prefecture.prefName}
          </label>
        </>
      ))}
    </div>
  );
}
