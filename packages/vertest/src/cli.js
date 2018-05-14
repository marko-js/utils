import { style } from "yargonaut";
import { version } from "yargs";
import { resolve } from "path";
import run from "./run";
import {
  MODE_LATEST,
  MODE_LATEST_MAJORS,
  MODE_LATEST_MINORS,
  MODE_MIN_MAX,
  MODE_MIN_MAX_MAJORS,
  MODE_MIN_MAX_MINORS,
  MODE_ALL
} from "./util";

style("blue")
  .style("yellow", "choices:")
  .style("cyan", "boolean", "number")
  .errorsStyle("red");

const argv = version(false)
  //.usage('$0 [options] -- [test command]', 'test a package with the versions of dependencies it claims to support')
  .option("v", {
    alias: "versions",
    describe: "Versions to include in the test matrix",
    default: "latest-majors",
    choices: [
      "latest",
      "latest-majors",
      "latest-minors",
      "min-max",
      "min-max-majors",
      "min-max-minors",
      "all"
    ],
    requiresArg: true
  })
  .option("p", {
    alias: "progress",
    describe: "Progress rendering style",
    default: "update",
    choices: ["silent", "update", "verbose"],
    requiresArg: true
  })
  .option("e", {
    alias: "epilogue",
    describe: "Epilogue rendering style",
    default: "failures",
    choices: ["silent", "failures", "verbose"],
    requiresArg: true
  })
  .option("c", {
    alias: "concurrency",
    number: true,
    describe: "Number of tests run at once",
    default: () => Math.max(1, Math.ceil(require("os").cpus().length / 2)),
    defaultDescription: "cores/2",
    requiresArg: true
  })
  .option("t", {
    alias: "threshold",
    number: true,
    describe: "Maximum number of tests to run",
    default: 25,
    requiresArg: true
  })
  .option("b", {
    alias: "bail",
    boolean: true,
    describe: "Exit on first failure",
    default: false
  })
  .option("d", {
    alias: "dependencies",
    array: true,
    describe: "Dependency fields in package.json",
    default: ["peerDependencies"],
    choices: ["dependencies", "peerDependencies", "optionalDependencies"],
    requiresArg: true
  })
  .option("ignore-engines", {
    boolean: true,
    describe: "Ignore current node version",
    default: false
  })
  .option("include-deprecated", {
    boolean: true,
    describe: "Test deprecated pkg versions",
    default: false
  })
  .option("cwd", {
    describe: "Directory of the package to test",
    requiresArg: true,
    hidden: true
  })
  .help(true)
  .wrap(null).argv;

const MODE_MAP = {
  latest: MODE_LATEST,
  "latest-majors": MODE_LATEST_MAJORS,
  "latest-minors": MODE_LATEST_MINORS,
  "min-max": MODE_MIN_MAX,
  "min-max-majors": MODE_MIN_MAX_MAJORS,
  "min-max-minors": MODE_MIN_MAX_MINORS,
  all: MODE_ALL
};

run({
  packageDir: resolve(process.cwd(), argv.cwd || "."),
  dependencies: argv.dependencies,
  includeDeprecated: argv.includeDeprecated,
  ignoreEngines: argv.ignoreEngines,
  bail: argv.bail,
  concurrency: argv.concurrency,
  threshold: argv.threshold,
  command: argv._.length ? argv._.join(" ") : "npm test",
  epilogue: argv.epilogue,
  progress: argv.progress,
  mode: MODE_MAP[argv.versions]
});
