/// <reference lib="dom" />

/** @jsxFrag React.Fragment */
/** @jsx React.createElement */
import React, { memo } from "./deps.ts";
import type { Prefectures } from "../server/types.ts";

export interface SelectBoxProps {
  /** 都道府県データ */
  prefectures: Prefectures;
  /** 都道府県の選択を切り替えたときに呼ばれる関数 */
  togglePrefecture(prefCode: number): void;
}

/** 県選択ボックスコンポーネント */
export const SelectBox = memo((props: SelectBoxProps) => (
  <div className="select-box">
    {props.prefectures.map((prefecture, i) => (
      <React.Fragment key={i}>
        <input
          id={`select-box-${prefecture.prefCode}`}
          type="checkbox"
          onChange={() => props.togglePrefecture(prefecture.prefCode)}
        />
        <label htmlFor={`select-box-${prefecture.prefCode}`}>
          {prefecture.prefName}
        </label>
      </React.Fragment>
    ))}
  </div>
));
