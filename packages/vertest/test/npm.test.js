import { getDependencyMetadata } from "../src/npm";
import { expect } from "chai";

describe("npm", function() {
  this.timeout(20000);
  describe("getDependencyMetadata", () => {
    it("query npm registry", async () => {
      const meta = await getDependencyMetadata({
        dedupe: "^1",
        decamelize: "^2"
      });
      expect(meta.dedupe.semverRange).to.eql("^1");
      expect(meta.dedupe.versions["1.0.0"].name).to.eql("dedupe");
      expect(meta.dedupe.versions["1.0.0"].version).to.eql("1.0.0");
      expect(meta.decamelize.semverRange).to.eql("^2");
      expect(meta.decamelize.versions["1.0.0"].name).to.eql("decamelize");
      expect(meta.decamelize.versions["1.0.0"].version).to.eql("1.0.0");
    });
    it("empty dependencies", async () => {
      const meta = await getDependencyMetadata({});
      expect(meta).to.eql({});
    });
  });
});
