/** @jsxFrag React.Fragment */
/** @jsx React.createElement */
import React from "./server_deps.ts";

/** 使い方表示コンポーネント */
export function Usage() {
  return (
    <section>
      <h2>使い方</h2>
      <ol>
        <li>都道府県を選択してください。</li>
        <li>選択した都道府県の総人口グラフが表示されます。</li>
      </ol>
    </section>
  );
}
