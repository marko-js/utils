import path from "path";
import autotest from "mocha-autotest";
import dependentPathUpdate from "../src";

describe("dependent-path-update", () => {
  autotest("fixtures", ({ dir, resolve, test, snapshot }) => {
    const renames = require(resolve("rename.json"));
    test(async () => {
      const changes = [];
      for (const [from, to] of Object.entries(renames)) {
        changes.push(`# RENAME: ${from} => ${to}`);
        const change = [];
        const changedFiles = await dependentPathUpdate({
          projectDir: dir,
          from,
          to,
          files: ["*.{js,json}"]
        });

        for (const [file, source] of Object.entries(changedFiles).sort(
          ([a], [b]) => a.localeCompare(b)
        )) {
          change.push(
            `## ${path.relative(dir, file)}\n\`\`\`${path
              .extname(file)
              .slice(1)}\n${source}\n\`\`\``
          );
        }

        changes.push(change.join("\n"));
      }

      snapshot(changes.join("\n\n"), {
        ext: ".md",
        name: "snapshot"
      });
    });
  });
});
