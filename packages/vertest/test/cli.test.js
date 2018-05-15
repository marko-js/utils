import path from "path";
import { execSync } from "child_process";
import { expect } from "chai";

const relative = p => path.relative(process.cwd(), path.resolve(__dirname, p));
const CLI_PATH = relative("../src/cli.js");
const FIXTURE_PATH = relative("./fixtures/package");
const CMD = `babel-node ${CLI_PATH} --cwd=${FIXTURE_PATH}`;

describe("vertest/cli", function() {
  this.timeout(40000);
  it("the fixture should pass with latest only", () => {
    execSync(`${CMD} --versions=latest --epilogue=silent`);
  });
  it("the fixture should fail with all (only latest passes)", () => {
    expect(() =>
      execSync(`${CMD} --versions=all --threshold=4 --concurrency=2`)
    ).to.throw("Command failed");
  });
});
