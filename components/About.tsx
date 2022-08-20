/** @jsxFrag React.Fragment */
/** @jsx React.createElement */
import React from "./server_deps.ts";

/** Aboutコンポーネント */
export function About() {
  return (
    <section>
      <h2>このWebサイトについて</h2>
      <ul>
        <li>都道府県の総人口をグラフとして表示します。</li>
        <li>
          データは<a
            target="_brank"
            href="https://opendata.resas-portal.go.jp/"
          >
            RESAS（地域経済分析システム）
          </a>を加工して作成しています。
        </li>
        <li>
          このWebサイトは<a
            target="_brank"
            href="https://notion.yumemi.co.jp/0e9ef27b55704d7882aab55cc86c999d"
          >
            株式会社ゆめみのフロントエンドコーディング試験
          </a>の課題を実装したものです。
        </li>
      </ul>
    </section>
  );
}
