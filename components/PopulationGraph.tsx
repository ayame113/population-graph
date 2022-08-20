/// <reference lib="dom" />

/** @jsxFrag React.Fragment */
/** @jsx React.createElement */
import React, { useCallback, useState } from "./deps.ts";
import { SelectBox } from "./SelectBox.tsx";
import { Graph, GraphProps } from "./Graph.tsx";
import type { Population, Prefectures } from "../types.ts";

/** 都道府県idがキーで、都道府県ごとの人口データが値のオブジェクト */
type PopulationRecord = Record<number, {
  /** ユーザーによって選択されているかどうか */
  selected: boolean;
  /** 読み込み中かどうか */
  isLoading: boolean;
  /** 人口データ (nullの場合はまだ読み込まれていないことを表す) */
  value: { [year: number]: number } | null;
  /** 都道府県名 */
  prefName: string;
}>;

/** 都道府県データ */
const prefectures: Prefectures = await (await fetch("/api/prefectures")).json();
console.log({ prefectures });
export function PopulationGraph() {
  const [populations, setPopulations] = useState<{ data: PopulationRecord }>({
    data: Object.fromEntries(
      prefectures.map(({ prefCode, prefName }) => [prefCode, {
        prefName,
        selected: false,
        isLoading: false,
        value: null,
      }]),
    ),
  });

  /** 都道府県の選択を切り替えたときに呼ばれる関数 */
  const togglePrefecture = useCallback((prefCode: number) => {
    const { data } = populations;
    // selectedの値を反転
    data[prefCode].selected = !data[prefCode].selected;

    // まだデータが読み込まれていない場合、APIからデータを読み込む
    if (!data[prefCode].isLoading && !data[prefCode].value) {
      data[prefCode].isLoading = true;
      getPopulationAPI(prefCode).then((population) => {
        // 読み込み完了後はデータをstateに格納する
        data[prefCode].value = population;
        data[prefCode].isLoading = false;

        // データを読み込んだ県が選択されていなければ、再レンダリングを抑制する
        const skipRender = !data[prefCode].selected;
        if (skipRender) {
          return;
        }

        setPopulations({ data });
      }, (err) => {
        alert("データの読み込みに失敗しました。");
        console.error(err);
      });
    }

    // 表示するデータがまだ存在しなければ、再レンダリングを抑制する
    const skipRender = !data[prefCode].value;
    if (skipRender) {
      return;
    }

    setPopulations({ data });
  }, []);

  return (
    <>
      <SelectBox
        prefectures={prefectures}
        togglePrefecture={togglePrefecture}
      />
      <Graph
        data={Object.values(populations.data)
          .filter((d) => d.value && d.selected) as GraphProps["data"]}
      />
    </>
  );
}

/**
 * APIから人口データを取得します。
 * @param prefCode 取得したい都道府県のコード
 */
async function getPopulationAPI(
  prefCode: number,
): Promise<{ [year: number]: number }> {
  const res = await fetch(`/api/population/${prefCode}`);
  if (!res.ok) {
    console.error("failed to fetch", res);
    throw new Error("failed to fetch");
  }
  const data: Population = await res.json();
  return Object.fromEntries(data.map((d) => [d.year, d.value]));
}
