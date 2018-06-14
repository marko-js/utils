import autotest from "../../../src";

autotest("fixtures-empty", ({ test }) => {
  test(() => {});
});

autotest("fixtures-skip-fail", ({ test, resolve, skip }) => {
  const main = require(resolve("test.js"));
  if (main.dynamicSkipReason) {
    skip(main.dynamicSkipReason);
  } else {
    test(() => main.run());
  }
});

autotest("fixtures-empty", {
  pass1: ({ test }) => {
    test(() => {});
  },
  pass2: ({ test }) => {
    test(() => {});
  }
});

autotest("fixtures-snapshot", ({ test, snapshot, resolve }) => {
  test(() => {
    snapshot(require(resolve("test.js")).actual, {
      ext: ".json"
    });
  });
});
