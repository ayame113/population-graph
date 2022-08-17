# population-graph

[![ci](https://github.com/ayame113/population-graph/actions/workflows/ci.yml/badge.svg)](https://github.com/ayame113/population-graph/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/ayame113/population-graph/branch/main/graph/badge.svg?token=phOYgELbvB)](https://codecov.io/gh/ayame113/population-graph)

Source code for https://popl.deno.dev/.

## develop

### ダウンロードとテスト実行

サーバー実行には[Deno](https://deno.land)が必要です。

```shell
> git clone git@github.com:ayame113/population-graph.git
> cd population-graph
> deno task serve # 開発サーバー起動
> deno task test # テスト実行
```

### 開発用コマンド

CIでは`deno task check` / `deno task test:coverage` / `deno task test:fmt` /
`deno task test:lint`が実行されます。

```shell
# start server
> deno task serve
# type checking
> deno task check
# run test
> deno task test
# run test (output coverage)
> deno task test:coverage
# run format
> deno fmt
# check format
> deno task test:fmt
# run lint
> deno lint
# check lint
> deno task test:lint
```
