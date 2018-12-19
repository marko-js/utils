# dependent-path-update

A tool to update dependent paths when renaming a file.

This uses regexps based on the folder depth to match all possible relative require paths in to file and updates all of those paths to a new path. Ultimately allowing you to rename a file and updating all dependents (not just js files!).

## Install

```bash
npm install --save dependent-path-update
```

## Usage

```javascript
import dependentPathUpdate from "dependent-path-update";

dependentPathUpdate({
  projectDir: process.cwd(), // The root directory of the project from which all paths should be relative.
  from: "src/file-a.js", // The original file path.
  to: "src/files/a.js", // The new file path.
  files: [
    // List of glob patterns of files to check.
    "*.{js,json}"
  ]
}).then(output => {
  // Output contains an object with all of the updated sources.
  console.log("updated all dependents");

  for (const file in output) {
    // Save all outputs to disk.
    fs.writeFileSync(file, output[file], "utf-8");
  }
});
```
