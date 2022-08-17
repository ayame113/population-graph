export type Routing = {
  pattern: URLPattern;
  route(
    url: URL,
    pattern: URLPatternResult,
    request: Request,
  ): Promise<Response | undefined>;
};
export type Prefectures = { prefCode: number; prefName: string }[];
export type Population = { year: number; value: number }[];
