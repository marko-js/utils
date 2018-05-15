import {
  renderEpilogue,
  renderPass,
  renderFail,
  renderSkip,
  renderSummary,
  renderVersions
} from "../src/render";
import { expect } from "chai";
import {
  bgGreen,
  bgRed,
  bgCyan,
  bgBlack,
  dim,
  blue,
  green,
  red,
  cyan
} from "chalk";

describe("vertest/render", () => {
  describe("renderEpilogue", () => {
    const sets = [
      {
        packages: {
          marko: {
            name: "marko",
            version: "4.0.0"
          },
          "marko-widgets": {
            name: "marko-widgets",
            version: "6.0.0"
          }
        },
        peerMismatch: {
          "marko-widgets": {
            marko: "^3"
          }
        }
      },
      {
        packages: {
          marko: {
            name: "marko",
            version: "3.0.0"
          },
          "marko-widgets": {
            name: "marko-widgets",
            version: "6.0.0"
          }
        },
        fail: true,
        output: "It broke"
      },
      {
        packages: {
          marko: {
            name: "marko",
            version: "4.0.0"
          },
          "marko-widgets": {
            name: "marko-widgets",
            version: "7.0.0"
          }
        },
        pass: true,
        output: "It worked"
      }
    ];
    it("failures only", () => {
      const output = renderEpilogue(sets, { epilogue: "failures" });
      expect(output).to.eql(`
${bgRed(" FAIL ")} marko${blue("@3.0.0")} marko-widgets${blue("@6.0.0")}

It broke

${bgBlack(" DONE ")} ${green(`1 passing`)}${red(` 1 failing`)}${cyan(
        ` 1 skipped`
      )}`);
    });
    it("verbose includes passes and skips", () => {
      const output = renderEpilogue(sets, { epilogue: "verbose" });
      expect(output).to.eql(`
${bgCyan(" SKIP ")} marko${blue("@4.0.0")} marko-widgets${blue("@6.0.0")}
       ${dim("marko-widgets@6.0.0 requires marko at ^3")}

${bgRed(" FAIL ")} marko${blue("@3.0.0")} marko-widgets${blue("@6.0.0")}

It broke

${bgGreen(" PASS ")} marko${blue("@4.0.0")} marko-widgets${blue("@7.0.0")}

It worked

${bgBlack(" DONE ")} ${green(`1 passing`)}${red(` 1 failing`)}${cyan(
        ` 1 skipped`
      )}`);
    });
  });
  describe("renderPass", () => {
    it("should be pretty", () => {
      const output = renderPass({
        packages: {
          marko: {
            name: "marko",
            version: "4.0.0"
          },
          lasso: {
            name: "lasso",
            version: "3.0.0"
          }
        },
        output: "Hello World"
      });
      expect(output).to.eql(
        `${bgGreen(" PASS ")} marko${blue("@4.0.0")} lasso${blue("@3.0.0")}

Hello World`
      );
    });
  });
  describe("renderFail", () => {
    it("should be pretty", () => {
      const output = renderFail({
        packages: {
          marko: {
            name: "marko",
            version: "4.0.0"
          },
          lasso: {
            name: "lasso",
            version: "3.0.0"
          }
        },
        output: "Hello World"
      });
      expect(output).to.eql(
        `${bgRed(" FAIL ")} marko${blue("@4.0.0")} lasso${blue("@3.0.0")}

Hello World`
      );
    });
  });
  describe("renderSkip", () => {
    it("should show engineMismatches", () => {
      const output = renderSkip({
        packages: {
          marko: {
            name: "marko",
            version: "4.0.0"
          },
          "marko-widgets": {
            name: "marko-widgets",
            version: "6.0.0"
          }
        },
        engineMismatch: {
          marko: ">= 4"
        }
      });
      expect(output).to.eql(
        `${bgCyan(" SKIP ")} marko${blue("@4.0.0")} marko-widgets${blue(
          "@6.0.0"
        )}
       ${dim("marko@4.0.0 requires node at >= 4")}`
      );
    });
    it("should show peerMismatches", () => {
      const output = renderSkip({
        packages: {
          marko: {
            name: "marko",
            version: "4.0.0"
          },
          "marko-widgets": {
            name: "marko-widgets",
            version: "6.0.0"
          }
        },
        peerMismatch: {
          "marko-widgets": {
            marko: "^3"
          }
        }
      });
      expect(output).to.eql(
        `${bgCyan(" SKIP ")} marko${blue("@4.0.0")} marko-widgets${blue(
          "@6.0.0"
        )}
       ${dim("marko-widgets@6.0.0 requires marko at ^3")}`
      );
    });
  });
  describe("renderSummary", () => {
    it("only passing", () => {
      const output = renderSummary([{ pass: true }]);
      expect(output).to.eql(`${bgBlack(" DONE ")} ${green(`1 passing`)}`);
    });
    it("passing, failing, skipped", () => {
      const output = renderSummary([{ pass: true }, { fail: true }, {}]);
      expect(output).to.eql(
        `${bgBlack(" DONE ")} ${green(`1 passing`)}${red(` 1 failing`)}${cyan(
          ` 1 skipped`
        )}`
      );
    });
  });
  describe("renderVersions", () => {
    it("should be pretty", () => {
      const output = renderVersions({
        marko: {
          name: "marko",
          version: "4.0.0"
        },
        lasso: {
          name: "lasso",
          version: "3.0.0"
        }
      });
      expect(output).to.eql(`marko${blue("@4.0.0")} lasso${blue("@3.0.0")}`);
    });
  });
});
