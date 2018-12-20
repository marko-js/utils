#!/usr/bin/env node

import fs from "mz/fs";
import path from "path";
import argly from "argly";
import dependentPathUpdate from "./";

const options = argly
  .createParser({
    "*": {
      type: "string[]",
      description: "The files to rename"
    },
    "--help -h": {
      type: "boolean",
      description: "Show this help message"
    },
    "--include -i": {
      type: "string[]",
      description: "File patterns to update"
    },
    "--exclude -e": {
      type: "string[]",
      description: "File patterns to ignore"
    },
    "--project-dir -d": {
      type: "string",
      description:
        "Directory in which dependents will be updated (defaults to CWD)"
    }
  })
  .usage("Usage: $0 <from> <to> [options]")
  .example("Move a file and update dependents", "$0 ./file-a.js ./files/a.js")
  .validate(function(result) {
    if (result.help) {
      this.printUsage();
      process.exit(0);
    }

    if (!result["*"] || result["*"].length !== 4) {
      this.printUsage();
      process.exit(1);
    }

    const [, , from, to] = result["*"];
    delete result["*"];

    result.projectDir = result.projectDir || process.cwd();
    result.from = path.resolve(result.projectDir, from);
    result.to = path.resolve(result.projectDir, to);
  })
  .onError(function(err) {
    this.printUsage();

    if (err) {
      console.log();
      console.log(err);
    }

    process.exit(1);
  })
  .parse(process.argv);

(async () => {
  try {
    const output = await dependentPathUpdate(options);
    await Promise.all(
      Object.entries(output)
        .map(([file, source]) => fs.writeFile(file, source, "utf-8"))
        .concat(fs.rename(options.from, options.to))
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
