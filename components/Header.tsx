/** @jsxFrag React.Fragment */
/** @jsx React.createElement */
import React from "./server_deps.ts";

/** ヘッダーコンポーネント */
export function Header() {
  return (
    <header>
      <h1>
        <a className="header-link" href="/">都道府県総人口グラフ</a>
      </h1>
    </header>
  );
}
