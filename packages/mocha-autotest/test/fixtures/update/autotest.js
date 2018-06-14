import autotest from "../../../src";

autotest("fixtures", ({ test, snapshot }) => {
  test(() => {
    snapshot("<div>Hello Autotest</div>");
  });
});
