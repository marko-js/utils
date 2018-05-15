import {
  blue,
  cyan,
  bgBlack,
  green,
  red,
  bgCyan,
  dim,
  bgGreen,
  bgRed
} from "chalk";

const BLANK_LINE = "\n\n";
const EPILOGUE_VERBOSE = "verbose";

export const renderEpilogue = (sets, options) => {
  let message = "";

  for (let set of sets) {
    if (set.fail) {
      message += BLANK_LINE + renderFail(set);
    } else if (options.epilogue === EPILOGUE_VERBOSE) {
      if (set.pass) {
        message += BLANK_LINE + renderPass(set);
      } else {
        message += BLANK_LINE + renderSkip(set);
      }
    }
  }

  message += BLANK_LINE + renderSummary(sets);

  return message.slice(1);
};

export const renderPass = set => {
  return `${bgGreen(" PASS ")} ${renderVersions(set.packages)}${BLANK_LINE}${
    set.output
  }`;
};

export const renderFail = set => {
  return `${bgRed(" FAIL ")} ${renderVersions(set.packages)}${BLANK_LINE}${
    set.output
  }`;
};

export const renderSkip = set => {
  let message = `${bgCyan(" SKIP ")} ${renderVersions(set.packages)}`;
  if (set.engineMismatch) {
    for (let pkg in set.engineMismatch) {
      message += "\n       ";
      message += dim(
        `${pkg}@${set.packages[pkg].version} requires node at ${
          set.engineMismatch[pkg]
        }`
      );
    }
  }
  if (set.peerMismatch) {
    for (let pkg in set.peerMismatch) {
      for (let peer in set.peerMismatch[pkg]) {
        message += "\n       ";
        message += dim(
          `${pkg}@${set.packages[pkg].version} requires ${peer} at ${
            set.peerMismatch[pkg][peer]
          }`
        );
      }
    }
  }
  return message;
};

export const renderSummary = sets => {
  let passing = 0;
  let failing = 0;
  let skipped = 0;

  for (let set of sets) {
    if (set.pass) passing++;
    else if (set.fail) failing++;
    else skipped++;
  }

  return `${bgBlack(" DONE ")} ${green(`${passing} passing`)}${
    failing ? red(` ${failing} failing`) : ""
  }${skipped ? cyan(` ${skipped} skipped`) : ""}`;
};

export const renderVersions = packages => {
  return Object.values(packages)
    .map(pkg => `${pkg.name}${blue("@" + pkg.version)}`)
    .join(" ");
};
