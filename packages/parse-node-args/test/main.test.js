import * as assert from "assert";
import parse from "../src";

describe("parse-node-args", () => {
  it("should extract supported node flags", () => {
    const nodeArgs = [
      "--abort-on-uncaught-exception",
      "--enable-fips",
      "--experimental-modules",
      "--experimental-vm-modules",
      "--force-fips",
      "--icu-data-dir=./test",
      "--inspect-brk",
      "--inspect-port=3000",
      "--napi-modules",
      "--no-deprecation",
      "--no-force-async-hooks-checks",
      "--no-warnings",
      "--openssl-config=./test.config",
      "--pending-deprecation",
      "--preserve-symlinks",
      "--prof-process",
      "--redirect-warnings=./test.logs",
      "--throw-deprecation",
      "--tls-cipher-list=./test/list",
      "--trace-deprecation",
      "--trace-event-categories",
      "--trace-event-file-pattern",
      "--trace-events-enabled",
      "--trace-sync-io",
      "--trace-warnings",
      "--track-heap-objects",
      "--use-bundled-ca",
      "--use-openssl-ca",
      "--v8-options",
      "--v8-pool-size=1",
      "--zero-fill-buffers",
      "--harmony-modules",
      "--require thing",
      "-r other-thing"
    ];

    const cliArgs = ["something", "--other"];

    assert.deepEqual(parse(nodeArgs.concat(cliArgs)), {
      cliArgs,
      nodeArgs
    });
  });

  it("should not care about order", () => {
    assert.deepEqual(parse(["./cli.js", "--my-option", "--inspect-brk"]), {
      cliArgs: ["./cli.js", "--my-option"],
      nodeArgs: ["--inspect-brk"]
    });
  });
});
