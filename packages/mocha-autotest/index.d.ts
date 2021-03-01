export type TestRunnerOpts = {
  resolve(req: string): string;
  test(fn: (() => void) | (() => Promise<void>)): ReturnType<typeof it>;
  skip(reason: string): void;
  dir: string;
  snapshot(a: unknown, b: unknown): void;
  mode: string;
  context: Record<string, unknown>;
  main: unknown;
};

export type TestRunner = (opts: TestRunnerOpts) => void;

export default function autotest(
  fixturesName: string,
  run: TestRunner | Record<string, TestRunner>
): void;
