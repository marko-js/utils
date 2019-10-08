/// <reference types="node" />
import { EventEmitter } from "events";

declare type VoidFunction = (...args: any[]) => void;
declare class AbortGroup {
    constructor();
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
     * @param val A cancel function, or a cancelable object.
     * @return A function to immediately abort the provided value.
     */
    add(val: VoidFunction | {
        [key: string]: any;
        abort?: VoidFunction;
        cancel?: VoidFunction;
        unsubscribe?: VoidFunction;
    }): VoidFunction;
    /**
     * Adds an event handler to an event emitter and builds a cancel function which will
     * be cleaned up when this tracker is aborted.
     *
     * @param emitter The emitter of the event.
     * @param event The event to listen to.
     * @param fn The handler to add.
     * @return A function to remove this event handler.
     */
    on(emitter: EventEmitter | EventTarget, event: string | symbol, fn: VoidFunction): VoidFunction;
    /**
     * Adds an event handler once to an event emitter and builds a cancel function which will
     * be cleaned up when this tracker is aborted.
     *
     * @param emitter The emitter of the event.
     * @param event The event to listen to.
     * @param fn The handler to add.
     * @return A function to remove this event handler.
     */
    once(emitter: EventEmitter | EventTarget, event: string | symbol, fn: VoidFunction): VoidFunction;
    /**
     * Like the native setTimeout, but can be canceled by this group.
     */
    setTimeout(...args: Parameters<typeof window.setTimeout>): VoidFunction;
    /**
     * Like the native setInterval, but can be canceled by this group.
     */
    setInterval(...args: Parameters<typeof window.setInterval>): VoidFunction;
    /**
     * Like the native setImmediate, but can be canceled by this group.
     */
    setImmediate(...args: Parameters<typeof global.setImmediate>): VoidFunction;
    /**
     * Like the native requestAnimationFrame, but can be canceled by this group.
     */
    requestAnimationFrame(...args: Parameters<typeof window.requestAnimationFrame>): VoidFunction;
    /**
     * Like the native requestIdleCallback, but can be canceled by this group.
     */
    requestIdleCallback(...args: Parameters<typeof window.requestAnimationFrame>): VoidFunction;
    /**
     * Creates a new CancelTracker which is bound to this one.
     * When the parent tracker is aborted, so is the forked tracker.
     *
     * @return A new tracker that is linked to the current tracker.
     */
    fork(): AbortGroup;
    /**
     * Cancels all existing running async tasks.
     */
    abort(): void;
}

/**
 * @description
 * Creates a group of async tasks that can be canceled at any time.
 *
 * @example
 * const group = abortGroup();
 * group.setTimeout(myFunction, 1000); // run after 1s.
 * group.abort(); // Stop the above timeout.
 */
export default function factory(): AbortGroup;
