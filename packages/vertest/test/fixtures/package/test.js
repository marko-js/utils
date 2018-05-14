// This "test" will fail if the version of `has-key-deep` is not ^2

try {
  const version = require("has-key-deep/package").version;
  const v2 = version[0] === "2";
  console.log({ v2, version });
  process.exit(v2 ? 0 : 1);
} catch (err) {
  console.log(err);
  process.exit(1);
}
