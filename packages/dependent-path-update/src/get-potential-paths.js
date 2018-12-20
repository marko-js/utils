import path from "path";
import getRelativeRequirePath from "./get-relative-require-path";

export default function getPotentialPaths(projectDir, from, to) {
  const fromDir = path.dirname(from);
  const projectRelativePath = path.relative(projectDir, fromDir);
  const toRelativePath = getRelativeRequirePath(fromDir, to);
  const potentialPaths = [toRelativePath];
  let index = projectRelativePath.length;
  let backtrack = "../";

  do {
    index = projectRelativePath.lastIndexOf("/", index - 2) + 1;
    potentialPaths.push(
      path.join(backtrack, projectRelativePath.slice(index), toRelativePath)
    );
    backtrack += "../";
  } while (index);

  return potentialPaths;
}
