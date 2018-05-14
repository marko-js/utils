/* eslint no-console: 0 */

import readPkgUp from "read-pkg-up";
import PackageRunner from "./package-runner";
import Observable from "zen-observable";
import Listr from "listr";
import { getDependencyMetadata } from "./npm";
import { getPackageSets, getDependencyVersions } from "./util";
import { renderEpilogue, renderVersions } from "./render";

const EPILOGUE_SILENT = "silent";

export default async options => {
  let packageSets;
  let testsFailed;

  await new Listr(
    [
      {
        title: "calculating dependency sets...",
        task: async () => {
          const packageData = await readPkgUp({ cwd: options.packageDir });
          const dependencies = options.dependencies.reduce(
            (deps, field) => Object.assign(deps, packageData.pkg[field]),
            {}
          );
          const dependenciesWithMeta = await getDependencyMetadata(
            dependencies
          );
          packageSets = getPackageSets(dependenciesWithMeta, options).filter(
            set =>
              (!set.engineMismatch || options.ignoreEngines) &&
              !set.peerMismatch
          );
        }
      }
    ],
    { renderer: options.progress, clearOutput: true }
  ).run();

  if (packageSets.length > options.threshold) {
    let total = packageSets.length;
    let threshold = options.threshold;
    let nth = Math.ceil(total / threshold);
    console.log(`Too many package sets: ${total}. Running every ${nth}th.`);
    packageSets = packageSets.filter((_, index) => index % nth === 0);
  }

  try {
    const workers = Array.apply(null, Array(options.concurrency)).map(
      () => new PackageRunner(options.packageDir)
    );
    await new Listr(
      packageSets.map(set => ({
        title: renderVersions(set.packages),
        task: () =>
          new Observable(async observer => {
            const worker = workers.pop();
            const dependencies = getDependencyVersions(set);

            try {
              observer.next("npm install");
              await worker.init(dependencies);
              observer.next(options.command);
              const result = await worker.run(options.command);
              set.pass = true;
              set.output = result.stdout;
              observer.complete();
            } catch (error) {
              set.fail = true;
              set.output = error.stdout || error.stack;
              observer.error(new Error());
            }
            workers.push(worker);
          })
      })),
      { concurrent: options.concurrency, exitOnError: false }
    ).run();
  } catch (e) {
    testsFailed = true;
  }

  if (options.epilogue !== EPILOGUE_SILENT) {
    console.log(renderEpilogue(packageSets, options));
  }

  if (testsFailed) {
    process.exit(1);
  }
};
