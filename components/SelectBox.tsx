/// <reference lib="dom" />

import React, { memo } from "./deps.ts";
import type { Prefectures } from "../types.ts";

export interface SelectBoxProps {
  /** 都道府県データ */
  prefectures: Prefectures;
  /** 都道府県の選択を切り替えたときに呼ばれる関数 */
  togglePrefecture(prefCode: number): void;
}

export const SelectBox = memo((props: SelectBoxProps) => (
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
));
