# abort-group

Group a set of cancelable actions to be aborted together at any time.

## Install

```bash
npm install --save abort-group
```

## Usage

```javascript
import abortGroup from "abort-group";

const group = abortGroup();

// Supports all `(set|request)Name` functions off of the window such as:
group.setTimeout(handleAnimationFrame, 1000);
group.setInterval(handleAnimationFrame, 1000);
group.requestAnimationFrame(handleAnimationFrame);

// Supports both nodejs and dom event emitters.
group.on(document.body, "click", handleClick);
group.once(document.body, "DOMContentLoaded", handleLoad);

// Can add cancel functions.
group.add(() => console.log("aborted"));

// Can add objects with a abort, cancel, or unsubscribe functions.
group.add({ abort: () => console.log("aborted") });
group.add({ cancel: () => console.log("aborted") });
group.add({ unsubscribe: () => console.log("aborted") });

// This means you can add other groups which get aborted when the parent does.
const subgroup = abortGroup();
group.add(subgroup);

// You can also add observables.
group.add(Rx.Observable.range(1, 5).subscribe(handleSubscription));
```

**finally**

```js
group.abort(); // Stop all async tasks above.
```

## API

#### `#set{NAME}(...args): function`

Calls the native `set` function such as `setTimeout`, passing all arguments, and clears it if the group is aborted.
Returns a function to cancel the task early.

_the methods are dynamically added based on what is available_

```javascript
group.setTimeout(() => ..., 500);
group.setInterval(() => ..., 500);
group.setImmediate(() => ...);

const stop = group.setTimeout(() => ..., 100);
stop(); // manually remove the timeout.
```

#### `#request{NAME}(...args): function`

Calls the native `request` function such as `requestAnimationFrame`, passing all arguments, and cancels it if the group is aborted.

_the methods are dynamically added based on what is available_

```javascript
group.requestAnimationFrame(() => ...);
group.requestIdleCallback(() => ...);

const stop = group.requestAnimationFrame(() => ...);
stop(); // manually remove the animation frame.
```

#### `#on(emitter: EventEmitter|EventTarget, type: string, handler: function): function`

Adds an event handler to the provided nodejs `EventEmitter` or browser `EventTarget` and removes the handler if the group is aborted.
Returns a function to cancel the handler early.

```javascript
const stop = group.on(window, "resize", handleResize);
stop(); // manually stop the event handler.
```

#### `#once(emitter: EventEmitter|EventTarget, type: string, handler: function): function`

Adds an event handler to the provided nodejs `EventEmitter` or browser `EventTarget` and removes the handler if the group is aborted or after the first call.

```javascript
const stop = group.once(window, "resize", handleResize); // Only handle one resize.
stop(); // manually stop the event handler.
```

#### `#add(cancelable): function`

Adds a cancelable object (one with an `abort`, `cancel` or `unsubscribe` method) to be canceled when the group aborts.
You can also pass a function to be called when the group aborts.

```javascript
group.add(handleAbort);
group.add({ abort: handleAbort });
group.add({ cancel: handleAbort });
group.add({ unsubscribe: handleAbort });

const stop = group.add(handleAbort);
stop(); // manually call the handleAbort function.
```

#### `#fork(): AbortGroup`

Creates a new group which is automatically aborted then the parent group is aborted.

```javascript
const subGroup = group.fork();
subGroup.setTimeout(() => ..., 100);
group.abort(); // Cancels sub group also.
```

#### `#abort()`

Aborts any tasks added to the group using the above methods.

```javascript
group.abort();
```
