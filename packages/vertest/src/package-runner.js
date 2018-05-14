import { join, basename } from "path";
import execa, { shell } from "execa";
import tempDir from "temp-dir";
import rimraf from "rimraf-then";
import copy from "recursive-copy";
import { readFile, writeFile } from "mz/fs";

class PackageRunner {
  constructor(directory) {
    this.sourceDirectory = directory;
  }
  path(name) {
    return join(this.targetDirectory, name);
  }
  async init(dependencies) {
    if (!this.targetDirectory) {
      this.targetDirectory = join(
        tempDir,
        basename(this.sourceDirectory) +
          "__" +
          Math.ceil(100000 * Math.random())
      );
      await copy(this.sourceDirectory, this.targetDirectory, {
        filter: ["**/*", "!package-lock.json", "!node_modules/**/*"]
      });
    } else {
      await rimraf(this.path("node_modules"));
      await rimraf(this.path("package-lock.json"));
    }
    await this.updatePackageJson(dependencies);
    await execa("npm", ["install"], { cwd: this.targetDirectory });
  }
  async updatePackageJson(dependencies) {
    const pkg = JSON.parse(await readFile(this.path("package.json"), "utf-8"));
    pkg.dependencies = Object.assign(pkg.dependencies || {}, dependencies);
    await writeFile(
      this.path("package.json"),
      JSON.stringify(pkg, null, 2),
      "utf-8"
    );
  }
  async run(command) {
    return await shell(command, {
      env: { FORCE_COLOR: "1" },
      cwd: this.targetDirectory
    });
  }
}

export default PackageRunner;
