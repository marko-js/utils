import fs from "fs";
import assert from "assert";
import { execSync } from "child_process";
import autotest from "../src";

const mochaBin = require.resolve("mocha/bin/mocha");
const mochaCmd = `${mochaBin} -r @babel/register`;

describe("mocha-autotest", function() {
  this.timeout(10000);
  autotest("fixtures", ({ test, resolve, snapshot }) => {
    test(() => {
      const env = require(resolve("env.json"));
      let output;
      let expected;
      let expectedFile;

      if (env.UPDATE_EXPECTATIONS) {
        expectedFile = resolve("fixtures/oops/expected.html");
        expected = fs.readFileSync(expectedFile, "utf-8");
      }

      try {
        output = execSync(`${mochaCmd} ${resolve("autotest.js")}`, {
          env: Object.assign({ NODE_ENV: "test" }, env)
        });
      } catch (e) {
        output = e.stdout;
      }

      if (env.UPDATE_EXPECTATIONS) {
        const updated = fs.readFileSync(expectedFile, "utf-8");
        fs.writeFileSync(expectedFile, expected, "utf-8");
        assert.notEqual(updated, expected);
      }

      snapshot(stripTestTimings(output.toString()), ".txt");
    });
  });
});

function stripTestTimings(output) {
  return output.replace(/ \(\d+ms\)/, "");
}
