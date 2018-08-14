const START_REG = /request|set/gi;

class Tracker {
  constructor() {
    this._ = [];
  }

  /**
   * @description
   * Adds a cancel function or object to the existing group.
   *
   * @example
   * group.add(myCancelFunction);
   * group.add({ abort: myCancelFunction });
   * group.add({ cancel: myCancelFunction });
   * group.add({ unsubscribe: myCancelFunction });
   *
   * @param {function|object} val a cancel function, or a cancelable object.
   * @return {any}
   */
  add(val) {
    const cancel =
      typeof val === "function"
        ? val
        : (val.abort || val.cancel || val.unsubscribe).bind(val);
    this._.push(cancel);
    return cancel;
  }

  /**
   * Adds an event handler to an event emitter and builds a cancel function which will
   * be cleaned up when this tracker is aborted.
   *
   * @param {EventEmitter|EventTarget} emitter The emitter of the event.
   * @param {string} event The event to listen to.
   * @param {function} fn The handler to add.
   * @return {function} A function to remove this event handler.
   */
  on(emitter, event, fn) {
    (emitter.addEventListener || emitter.on).call(emitter, event, fn);
    return this.add(
      (emitter.removeEventListener || emitter.removeListener).bind(
        emitter,
        event,
        fn
      )
    );
  }

  /**
   * Adds an event handler once to an event emitter and builds a cancel function which will
   * be cleaned up when this tracker is aborted.
   *
   * @param {EventEmitter|EventTarget} emitter The emitter of the event.
   * @param {string} event The event to listen to.
   * @param {function} fn The handler to add.
   * @return {function} A function to remove this event handler.
   */
  once(emitter, event, fn) {
    const cancel = this.on(emitter, event, (...args) => {
      cancel();
      fn(...args);
    });

    return cancel;
  }

  /**
   * Creates a new CancelTracker which is bound to this one.
   * When the parent tracker is aborted, so is the forked tracker.
   *
   * @return {CancelTracker}
   */
  fork() {
    const child = new Tracker();
    this.add(child);
    return child;
  }

  /**
   * Cancels all existing running async tasks.
   */
  abort() {
    const fns = this._;
    for (let i = fns.length; i--; ) fns[i]();
    fns.length = 0;
  }
}

/**
 * Factory for CancelTracker which adds misc async methods such as `setTimeout`
 * and `requestAnimationFrame` to the prototype based on whats available on the global object
 * on the first call.
 */
let create = () => {
  for (const key in global) {
    const run = global[key] || 0;
    const cancel = global[key.replace(START_REG, toCancelName)] || 0;
    if (run !== cancel) {
      Tracker.prototype[key] = function(...args) {
        return this.add(cancel.bind(null, run(...args)));
      };
    }
  }

  return (create = function() {
    return new Tracker();
  })();
};

/**
 * @description
 * Creates a group of async tasks that can be canceled at any time.
 *
 * @example
 * const group = abortGroup();
 * group.setTimeout(myFunction, 1000); // run after 1s.
 * group.abort(); // Stop the above timeout.
 */
module.exports = exports = () => create();
export default exports;

/**
 * Given a name like 'request' or 'set', returns the opposite cancel name ('cancel' or 'clear').
 */
function toCancelName([char]) {
  const upper = char.toUpperCase();
  return (upper === char ? "C" : "c") + (upper === "R" ? "ancel" : "lear");
}
