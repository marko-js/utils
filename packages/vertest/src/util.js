import semver from "semver";

export const NODE_VERSION = process.version.slice(1);

export const MODE_LATEST = 0;
export const MODE_LATEST_MAJORS = 1;
export const MODE_LATEST_MINORS = 2;
export const MODE_MIN_MAX = 3;
export const MODE_MIN_MAX_MAJORS = 4;
export const MODE_MIN_MAX_MINORS = 5;
export const MODE_ALL = 6;

export const getDependencyVersions = set => {
  const map = {};
  for (let packageName in set.packages) {
    map[packageName] = set.packages[packageName].version;
  }
  return map;
};

export const validateDependencySet = dependencySet => {
  for (let name in dependencySet.packages) {
    let packageData = dependencySet.packages[name];
    let engine = packageData.engines && packageData.engines.node;
    let peers = packageData.peerDependencies;
    if (engine && !semver.satisfies(NODE_VERSION, engine)) {
      dependencySet.engineMismatch = dependencySet.engineMismatch || {};
      dependencySet.engineMismatch[name] = engine;
    }
    if (peers) {
      for (let subname in peers) {
        let subpackage = dependencySet.packages[subname];
        let required = peers[subname];
        if (packageData && !semver.satisfies(subpackage.version, required)) {
          dependencySet.peerMismatch = dependencySet.peerMismatch || {};
          dependencySet.peerMismatch[name] =
            dependencySet.peerMismatch[name] || {};
          dependencySet.peerMismatch[name][subname] = required;
        }
      }
    }
  }
};

export const getPackageSets = (exports.getPackageSets = (
  dependencies,
  options
) => {
  let filteredDependencies = [];
  for (let name in dependencies) {
    let dependency = dependencies[name];
    filteredDependencies.push(
      filterVersions(dependency.versions, dependency.semverRange, options)
    );
  }

  let packageSets = buildPackageMatrix(filteredDependencies);
  let fullMatrixSize = packageSets.length;
  let minimalMatrixSize;

  if (fullMatrixSize > options.threshold) {
    packageSets = buildMinimalPackageMatrix(filteredDependencies);
    minimalMatrixSize = packageSets.length;
  }

  packageSets = packageSets.map(set => {
    let packages = {};
    for (let version of set) {
      packages[version.name] = version;
    }
    set = { packages };
    validateDependencySet(set);
    return set;
  });

  packageSets.fullMatrixSize = fullMatrixSize;
  packageSets.minimalMatrixSize = minimalMatrixSize;

  return packageSets;
});

export const filterVersions = (exports.filterVersions = (
  allVersions,
  semverRange,
  { includeDeprecated, mode }
) => {
  const versionStrings = Object.keys(allVersions)
    .filter(version => {
      return includeDeprecated || !allVersions[version].deprecated;
    })
    .filter(version => {
      return semver.satisfies(version, semverRange);
    })
    .sort((v1, v2) => {
      return semver.lt(v1, v2) ? -1 : 1;
    });

  const latestVersionString = versionStrings[versionStrings.length - 1];

  if (mode === MODE_LATEST) {
    return [allVersions[latestVersionString]];
  } else if (mode === MODE_MIN_MAX) {
    return [allVersions[versionStrings[0]], allVersions[latestVersionString]];
  } else if (mode === MODE_ALL) {
    return versionStrings.map(v => allVersions[v]);
  } else if (
    mode === MODE_LATEST_MAJORS ||
    mode === MODE_MIN_MAX_MAJORS ||
    mode === MODE_LATEST_MINORS ||
    mode === MODE_MIN_MAX_MINORS
  ) {
    let prevMajor = null;
    let prevMinor = null;
    let prevVersion = null;
    let lastPushedVersion = null;
    let versions = [];

    for (let version of versionStrings) {
      let major = semver.major(version);
      let minor = semver.minor(version);

      if (
        major !== prevMajor ||
        (minor !== prevMinor &&
          (mode === MODE_LATEST_MINORS || mode === MODE_MIN_MAX_MINORS))
      ) {
        // the previous version is the highest for that major/minor
        if (prevVersion !== lastPushedVersion) {
          versions.push(allVersions[prevVersion]);
          lastPushedVersion = prevVersion;
        }
        // the current version is the lowest for this major/minor
        if (mode === MODE_MIN_MAX_MAJORS || mode === MODE_MIN_MAX_MINORS) {
          versions.push(allVersions[version]);
          lastPushedVersion = version;
        }
      }

      if (version === latestVersionString && version !== lastPushedVersion) {
        // the latest version is the highest for this major
        versions.push(allVersions[version]);
      }

      prevMajor = major;
      prevMinor = minor;
      prevVersion = version;
    }

    return versions;
  }
});

export const buildPackageMatrix = ([first, ...remaining]) => {
  if (!first) return [];
  if (!remaining.length) return first.map(v => [v]);

  let matrix = [];

  for (let version of first) {
    for (let combination of buildPackageMatrix(remaining)) {
      matrix.push([version].concat(combination));
    }
  }

  return matrix;
};

export const buildMinimalPackageMatrix = dependencies => {
  const matrix = [];
  const existing = {};
  for (let dep of dependencies) {
    for (let version of dep) {
      const set = [];
      for (let otherDep of dependencies) {
        if (dep === otherDep) {
          set.push(version);
        } else {
          const validDependencies = otherDep.filter(dep => {
            const peers = dep.peerDependencies;
            const required = peers && peers[version.name];
            return !required || semver.satisfies(version.version, required);
          });
          const latestMatch = validDependencies[validDependencies.length - 1];
          set.push(latestMatch ? latestMatch : otherDep[otherDep.length - 1]);
        }
      }
      const id = set.map(v => v.version).join(" ");
      if (!existing[id]) {
        matrix.push(set);
        existing[id] = true;
      }
    }
  }
  return matrix;
};
