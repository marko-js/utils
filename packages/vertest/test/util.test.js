import {
  getDependencyVersions,
  validateDependencySet,
  getPackageSets,
  filterVersions,
  buildPackageMatrix,
  buildMinimalPackageMatrix,
  MODE_LATEST,
  MODE_LATEST_MAJORS,
  MODE_LATEST_MINORS,
  MODE_MIN_MAX,
  MODE_MIN_MAX_MAJORS,
  MODE_MIN_MAX_MINORS,
  MODE_ALL
} from "../src/util";
import dependencyMetadata from "./fixtures/data/dependency-metadata.json";
import { expect } from "chai";

describe("vertest/util", () => {
  describe("getDependencyVersions", () => {
    const dedupe = dependencyMetadata.dedupe.versions["1.0.0"];
    const decamelize = dependencyMetadata.decamelize.versions["1.0.0"];
    it("should return an object like the package.json dependency field", () => {
      const set = { packages: { dedupe, decamelize } };
      const dependencies = getDependencyVersions(set);
      expect(dependencies).to.eql({
        dedupe: "1.0.0",
        decamelize: "1.0.0"
      });
    });
  });
  describe("validateDependencySet", () => {
    const dedupe = dependencyMetadata.dedupe.versions["1.0.0"];
    const decamelize = dependencyMetadata.decamelize.versions["1.0.0"];
    it("should find engine and peer mismatches", () => {
      const set = {
        packages: {
          dedupe: {
            ...dedupe,
            peerDependencies: {
              decamelize: "^2" //peer mismatch
            },
            engines: {
              node: ">= 1000" //engine mismatch
            }
          },
          decamelize: {
            ...decamelize,
            peerDependencies: {
              dedupe: "^1" //peer match
            },
            engines: {
              node: ">= 0.10" //engine match
            }
          }
        }
      };
      validateDependencySet(set);
      expect(set.engineMismatch.dedupe).to.eql(">= 1000");
      expect(set.engineMismatch.decamelize).to.eql(undefined);
      expect(set.peerMismatch.dedupe.decamelize).to.eql("^2");
      expect(set.peerMismatch.decamelize).to.eql(undefined);
    });
  });
  describe("getPackageSets", () => {
    it("should build a full matrix", () => {
      const sets = getPackageSets(dependencyMetadata, {
        mode: MODE_LATEST_MINORS
      });
      expect(sets.length).to.eql(6);
      expect(sets.fullMatrixSize).to.eql(6);
      expect(sets.minimalMatrixSize).to.eql(undefined);
      expect(sets[0].packages.dedupe.version).to.eql("2.0.3");
      expect(sets[0].packages.decamelize.version).to.eql("1.0.0");
      // see buildFullMatrix for full assertions on the matrix output
    });
    it("should fallback to a minimal matrix when threshold reached", () => {
      const sets = getPackageSets(dependencyMetadata, {
        mode: MODE_ALL,
        threshold: 10
      });
      expect(sets.length).to.eql(9);
      expect(sets.fullMatrixSize).to.eql(25);
      expect(sets.minimalMatrixSize).to.eql(9);
      expect(sets[0].packages.dedupe.version).to.eql("2.0.0");
      expect(sets[0].packages.decamelize.version).to.eql("1.2.0");
      // see buildMinimalMatrix for full assertions on the matrix output
    });
  });
  describe("filterVersions", () => {
    const versions = dependencyMetadata.dedupe.versions;
    it("should get the latest version", () => {
      const filtered = filterVersions(versions, "*", { mode: MODE_LATEST });
      expect(filtered.length).to.eql(1);
      expect(filtered[0].version).to.eql("2.1.0");
    });
    it("should get the latest majors versions", () => {
      const filtered = filterVersions(versions, "*", {
        mode: MODE_LATEST_MAJORS
      });
      expect(filtered.length).to.eql(3);
      expect(filtered[0].version).to.eql("0.2.8");
      expect(filtered[1].version).to.eql("1.0.2");
      expect(filtered[2].version).to.eql("2.1.0");
    });
    it("should get the latest minor versions", () => {
      const filtered = filterVersions(versions, "*", {
        mode: MODE_LATEST_MINORS
      });
      expect(filtered.length).to.eql(5);
      expect(filtered[0].version).to.eql("0.1.0");
      expect(filtered[1].version).to.eql("0.2.8");
      expect(filtered[2].version).to.eql("1.0.2");
      expect(filtered[3].version).to.eql("2.0.3");
      expect(filtered[4].version).to.eql("2.1.0");
    });
    it("should get the min and max versions", () => {
      const filtered = filterVersions(versions, "*", { mode: MODE_MIN_MAX });
      expect(filtered.length).to.eql(2);
      expect(filtered[0].version).to.eql("0.1.0");
      expect(filtered[1].version).to.eql("2.1.0");
    });
    it("should get the min and max major versions", () => {
      const filtered = filterVersions(versions, "*", {
        mode: MODE_MIN_MAX_MAJORS
      });
      expect(filtered.length).to.eql(6);
      expect(filtered[0].version).to.eql("0.1.0");
      expect(filtered[1].version).to.eql("0.2.8");
      expect(filtered[2].version).to.eql("1.0.0");
      expect(filtered[3].version).to.eql("1.0.2");
      expect(filtered[4].version).to.eql("2.0.0");
      expect(filtered[5].version).to.eql("2.1.0");
    });
    it("should get the min and max minor versions", () => {
      const filtered = filterVersions(versions, "*", {
        mode: MODE_MIN_MAX_MINORS
      });
      expect(filtered.length).to.eql(8);
      expect(filtered[0].version).to.eql("0.1.0");
      expect(filtered[1].version).to.eql("0.2.0");
      expect(filtered[2].version).to.eql("0.2.8");
      expect(filtered[3].version).to.eql("1.0.0");
      expect(filtered[4].version).to.eql("1.0.2");
      expect(filtered[5].version).to.eql("2.0.0");
      expect(filtered[6].version).to.eql("2.0.3");
      expect(filtered[7].version).to.eql("2.1.0");
    });
    it("should get the all versions", () => {
      const filtered = filterVersions(versions, "*", { mode: MODE_ALL });
      expect(filtered.length).to.eql(18);
    });
    it("should return nothing, if no mode passed", () => {
      const filtered = filterVersions(versions, "*", { mode: null });
      expect(filtered).to.eql(undefined);
    });
  });
  describe("buildPackageMatrix", () => {
    const dedupe = dependencyMetadata.dedupe.versions;
    const decamelize = dependencyMetadata.decamelize.versions;

    it("should build all possible matches", () => {
      const matrix = buildPackageMatrix([
        [dedupe["1.0.0"], dedupe["2.0.0"]],
        [decamelize["1.0.0"], decamelize["2.0.0"]]
      ]);
      expect(matrix.length).to.eql(4);
      expect(matrix).eql([
        [dedupe["1.0.0"], decamelize["1.0.0"]],
        [dedupe["1.0.0"], decamelize["2.0.0"]],
        [dedupe["2.0.0"], decamelize["1.0.0"]],
        [dedupe["2.0.0"], decamelize["2.0.0"]]
      ]);
    });
    it("should return an empty array if no matches", () => {
      const matrix = buildPackageMatrix([]);
      expect(matrix.length).to.eql(0);
      expect(matrix).eql([]);
    });
  });
  describe("buildMinimalPackageMatrix", () => {
    const dedupe = dependencyMetadata.dedupe.versions;
    const decamelize = dependencyMetadata.decamelize.versions;

    it("should build a minimal set of matches", () => {
      const matrix = buildMinimalPackageMatrix([
        [dedupe["1.0.0"], dedupe["2.0.0"]],
        [decamelize["1.0.0"], decamelize["2.0.0"]]
      ]);
      expect(matrix.length).to.eql(3);
      expect(matrix).eql([
        [dedupe["1.0.0"], decamelize["2.0.0"]],
        [dedupe["2.0.0"], decamelize["2.0.0"]],
        [dedupe["2.0.0"], decamelize["1.0.0"]]
      ]);
    });

    it("should take peerDependencies into account", () => {
      const dedupeLegacy = {
        ...dedupe["1.0.0"],
        peerDependencies: {
          decamelize: "^1"
        }
      };
      const matrix = buildMinimalPackageMatrix([
        [dedupeLegacy, dedupe["2.0.0"]],
        [decamelize["1.0.0"], decamelize["2.0.0"]]
      ]);
      expect(matrix.length).to.eql(3);
      expect(matrix).eql([
        [dedupeLegacy, decamelize["1.0.0"]],
        [dedupe["2.0.0"], decamelize["2.0.0"]],
        [dedupe["2.0.0"], decamelize["1.0.0"]]
      ]);
    });
  });
});
