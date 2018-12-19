import fs from "mz/fs";
import path from "path";
import escapeRegexp from "escape-string-regexp";
import getFiles from "./get-files";
import getRelativeRequirePath from "./get-relative-require-path";
import getPotentialPaths from "./get-potential-paths";

const GLOB_DEFAULTS = {
  matchBase: true,
  absolute: true,
  dot: false,
  ignore: ["**/node_modules/"]
};

export default async function({
  from,
  to,
  files: patterns,
  projectDir = process.cwd()
}) {
  const originalExtReg = `(${escapeRegexp(path.extname(from))})?`;
  const originalPath = path.resolve(projectDir, from);
  const updatedExt = path.extname(to);
  const updatedPath = path.resolve(projectDir, to);
  const originalIsIndex = isIndexFile(originalPath);
  const updatedIsIndex = isIndexFile(updatedPath);
  const changedFiles = {};

  const files = await getFiles(patterns, {
    ...GLOB_DEFAULTS,
    cwd: projectDir
  });

  await Promise.all(
    files.map(async file => {
      if (file === originalPath) {
        return;
      }

      const relativePathToUpdated = getRelativeRequirePath(
        path.dirname(file),
        removeIndexAndExt(updatedPath)
      );

      const validPathsForFile = getPotentialPaths(
        projectDir,
        file,
        removeIndexAndExt(originalPath)
      ).map(escapeRegexp);

      if (validPathsForFile[0] === "\\.") {
        validPathsForFile[0] += "\\/?";
      }

      const validPathsRegexp = new RegExp(
        `(["'])` + // Match a quote
        `(.+ +)?` + // Followed by any characters + spaces (eg: "require: ./abc" for browser.json files)
        `(?:${validPathsForFile.join("|")})` + // Followed by any valid relative path to the original file.
        `(${originalIsIndex ? "\\/index" : ""}${originalExtReg})?` + // And optional index + extension
          `\\1`, // Followed by the closing matching quote
        "g"
      );

      const originalSource =
        changedFiles[file] || (await fs.readFile(file, "utf8"));
      const updatedSource = originalSource.replace(
        validPathsRegexp,
        (_, quote, prefix = "", foundIndex, foundExt) => {
          foundIndex = foundIndex !== foundExt;
          return (
            quote +
            prefix +
            relativePathToUpdated +
            (foundIndex && updatedIsIndex ? "/index" : "") +
            ((!updatedIsIndex || foundIndex) && foundExt ? updatedExt : "") +
            quote
          );
        }
      );

      if (originalSource !== updatedSource) {
        changedFiles[file] = updatedSource;
      }
    })
  );

  return changedFiles;
}

function removeIndexAndExt(str) {
  return str.replace(/(?:\/index)?\..*$/, "");
}

function isIndexFile(str) {
  return /\/index\..*$/.test(str);
}
