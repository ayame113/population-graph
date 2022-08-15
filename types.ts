export type Routing = {
  pattern: URLPattern;
  route(
    url: URL,
    pattern: URLPatternResult,
    request: Request,
  ): Promise<Response | undefined>;
};
export type Population = { year: number; value: number }[];
