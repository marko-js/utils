import path from "path";

export default function getRelativePath(from, to) {
  const result = path.relative(from, to);

  if (result === "") {
    return ".";
  }

  if (result[0] !== ".") {
    return "./" + result;
  }

  return result;
}
