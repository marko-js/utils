import { spy } from "sinon";
import * as assert from "assert";
import { EventEmitter } from "events";
import abortGroup from "../src";

describe("abort-group", () => {
  describe("#on", () => {
    let group, emitter, eventSpy, cancel;

    beforeEach(() => {
      group = abortGroup();
      emitter = new EventEmitter();
      eventSpy = spy();
      cancel = group.on(emitter, "name", eventSpy);
    });

    it("should attach event handler", () => {
      emitter.emit("name", "a");
      assert.ok(eventSpy.calledOnce);
      assert.equal(eventSpy.getCall(0).args[0], "a");

      emitter.emit("name", "b");
      assert.ok(eventSpy.calledTwice);
      assert.equal(eventSpy.getCall(1).args[0], "b");
    });

    it("should remove handler on abort", () => {
      emitter.emit("name", "a");
      assert.ok(eventSpy.calledOnce);

      group.abort();

      emitter.emit("name", "b");
      assert.ok(eventSpy.calledOnce);
    });

    it("should remove event handler on cancel", () => {
      emitter.emit("name", "a");
      assert.ok(eventSpy.calledOnce);

      cancel();

      emitter.emit("name", "b");
      assert.ok(eventSpy.calledOnce);
    });
  });

  describe("#once", () => {
    let group, emitter, eventSpy, cancel;

    beforeEach(() => {
      group = abortGroup();
      emitter = new EventEmitter();
      eventSpy = spy();
      cancel = group.once(emitter, "name", eventSpy);
    });

    it("should attach event handler once", () => {
      emitter.emit("name", "a");
      assert.ok(eventSpy.calledOnce);
      assert.equal(eventSpy.getCall(0).args[0], "a");

      emitter.emit("name", "b");
      assert.ok(eventSpy.calledOnce);
    });

    it("should remove handlers on abort", () => {
      group.abort();

      emitter.emit("name", "a");
      assert.ok(eventSpy.notCalled);
    });

    it("should remove event handler on cancel", () => {
      cancel();

      emitter.emit("name", "a");
      assert.ok(eventSpy.notCalled);
    });
  });

  describe("#set|request{Name}", () => {
    it("should expose all functions", () => {
      const group = abortGroup();
      assert.ok(group.setTimeout);
      assert.ok(group.setInterval);
      assert.ok(group.setImmediate);
    });

    it("should dynamically add new functions during initialization", () => {
      const startSpy = spy();
      const cancelSpy = spy();
      global.requestNow = global.setNow = startSpy;
      global.cancelNow = global.clearNow = cancelSpy;

      // Reload the module.
      delete require.cache[require.resolve("../src")];
      const group = require("../src")();

      assert.ok(group.setNow);
      assert.ok(group.requestNow);

      group.setNow();
      group.requestNow();

      assert.ok(startSpy.calledTwice);
      assert.ok(cancelSpy.notCalled);

      group.abort();

      assert.ok(cancelSpy.calledTwice);
    });
  });

  describe("#add", () => {
    it("should call an added function on abort", () => {
      const group = abortGroup();
      const abortSpy = spy();

      group.add(abortSpy);
      group.abort();

      assert.ok(abortSpy.calledOnce);
    });

    it("should abort an added group", () => {
      const groupA = abortGroup();
      const groupB = abortGroup();
      const abortSpy = spy();

      groupA.add(groupB);
      groupB.add(abortSpy);

      groupA.abort();

      assert.ok(abortSpy.calledOnce);
    });

    it("should abort an object with a abort, cancel or unsubscribe method", () => {
      const group = abortGroup();
      const abortSpy = spy();

      group.add({ abort: abortSpy });
      group.add({ cancel: abortSpy });
      group.add({ unsubscribe: abortSpy });
      group.abort();
      assert.ok(abortSpy.calledThrice);
    });
  });

  describe("#fork", () => {
    it("should return a new abort group", () => {
      const groupA = abortGroup();
      const groupB = groupA.fork();
      assert.ok(groupA.constructor === groupB.constructor);
    });

    it("should abort the child when the parent aborts", () => {
      const groupA = abortGroup();
      const groupB = groupA.fork();
      const abortSpy = spy();

      groupB.add(abortSpy);
      groupA.abort();

      assert.ok(abortSpy.calledOnce);
    });

    it("should not abort the parent when the child aborts", () => {
      const groupA = abortGroup();
      const groupB = groupA.fork();
      const abortSpy = spy();

      groupA.add(abortSpy);
      groupB.abort();

      assert.ok(abortSpy.notCalled);
    });
  });
});
