/** サーバーのルーティングを行うオブジェクト */
export type Routing = {
  /** このパターンにマッチした場合にroute関数が呼ばれる */
  pattern: URLPattern;
  /**
   * パターンにマッチした場合に呼ばれる関数
   * @param  url リクエストされたURL
   * @param  pattern URLPatternへのマッチ結果
   * @param  request リクエスト情報
   * @return レスポンス
   */
  route(
    url: URL,
    pattern: URLPatternResult,
    request: Request,
  ): Promise<Response | undefined> | Response | undefined;
};
export type Prefectures = { prefCode: number; prefName: string }[];
export type Population = { year: number; value: number }[];
