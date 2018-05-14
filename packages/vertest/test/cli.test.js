import path from "path";
import { execSync } from "child_process";
import { expect } from "chai";

const relative = p => path.relative(process.cwd(), path.resolve(__dirname, p));
const CLI_PATH = relative("../src/cli.js");
const FIXTURE_PATH = relative("./fixtures/package");
const CMD = `babel-node ${CLI_PATH} --cwd=${FIXTURE_PATH}`;

describe("cli", function() {
  this.timeout(20000);
  it("the fixture should pass with latest only", () => {
    try {
      execSync(`${CMD} --versions=latest`);
    } catch (e) {
      console.log(Object.keys(e));
      console.log(e);
      throw e;
    }
  });
  it("the fixture should fail with latest-majors", () => {
    expect(() => execSync(`${CMD} --versions=latest-majors`)).to.throw(
      "Command failed"
    );
  });
});
