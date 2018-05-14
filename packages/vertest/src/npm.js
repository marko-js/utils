import packageJson from "package-json";

/**
 * Get version meta data for a dependencies object from the registry
 *
 * @param dependencies an object where keys are dependency names and values are semver ranges
 */
export const getDependencyMetadata = async dependencies => {
  for (let packageName in dependencies) {
    let semverRange = dependencies[packageName];
    dependencies[packageName] = {
      semverRange,
      versions: (await packageJson(packageName, {
        allVersions: true
      })).versions
    };
  }
  return dependencies;
};
