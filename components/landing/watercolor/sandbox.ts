/**
 * Runs the landing's DOM script with stand-ins for window, document, timers and observers that remember
 * everything the script starts, so dispose() can stop it all when the page unmounts (client-side navigation
 * away from "/"). Without this, animation loops, scroll listeners and WebGL contexts would keep running.
 */
type Listener = [EventTarget, string, EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined];

export function createSandbox(root: HTMLElement) {
    let dead = false;
    const timeouts = new Set<number>();
    const intervals = new Set<number>();
    const frames = new Set<number>();
    const listeners: Listener[] = [];
    const observers = new Set<{ disconnect(): void }>();

    const listen = (target: EventTarget) =>
        (type: string, fn: EventListenerOrEventListenerObject, opts?: boolean | AddEventListenerOptions) => {
            target.addEventListener(type, fn, opts);
            listeners.push([target, type, fn, opts]);
        };
    const unlisten = (target: EventTarget) =>
        (type: string, fn: EventListenerOrEventListenerObject, opts?: boolean | EventListenerOptions) =>
            target.removeEventListener(type, fn, opts);

    const setTimeoutT = (fn: () => void, ms?: number) => {
        const id = window.setTimeout(() => { timeouts.delete(id); if (!dead) fn(); }, ms);
        timeouts.add(id);
        return id;
    };
    const setIntervalT = (fn: () => void, ms?: number) => {
        const id = window.setInterval(() => { if (!dead) fn(); }, ms);
        intervals.add(id);
        return id;
    };
    const requestAnimationFrameT = (fn: FrameRequestCallback) => {
        if (dead) return 0;
        const id = window.requestAnimationFrame((t) => { frames.delete(id); if (!dead) fn(t); });
        frames.add(id);
        return id;
    };
    class TrackedIntersectionObserver extends IntersectionObserver {
        constructor(cb: IntersectionObserverCallback, o?: IntersectionObserverInit) { super(cb, o); observers.add(this); }
    }
    class TrackedResizeObserver extends ResizeObserver {
        constructor(cb: ResizeObserverCallback) { super(cb); observers.add(this); }
    }
    class TrackedMutationObserver extends MutationObserver {
        constructor(cb: MutationCallback) { super(cb); observers.add(this); }
    }

    const addWindowListener = listen(window);
    const removeWindowListener = unlisten(window);
    const override: Record<PropertyKey, unknown> = {
        addEventListener: addWindowListener,
        removeEventListener: removeWindowListener,
        setTimeout: setTimeoutT,
        setInterval: setIntervalT,
        requestAnimationFrame: requestAnimationFrameT,
    };
    // reads fall through to the real object; methods are bound so `this` stays the real window/document
    const proxy = <T extends object>(real: T, own: Record<PropertyKey, unknown>): T =>
        new Proxy(real, {
            get(t, k) {
                if (k in own) return own[k];
                const v = Reflect.get(t, k, t);
                return typeof v === "function" && !/^[A-Z]/.test(String(k)) ? v.bind(t) : v;
            },
            set: (t, k, v) => Reflect.set(t, k, v, t),
        });

    const env = {
        window: proxy(window, override),
        document: proxy(document, { addEventListener: listen(document), removeEventListener: unlisten(document) }),
        addEventListener: addWindowListener,
        removeEventListener: removeWindowListener,
        setTimeout: setTimeoutT,
        setInterval: setIntervalT,
        requestAnimationFrame: requestAnimationFrameT,
        IntersectionObserver: TrackedIntersectionObserver,
        ResizeObserver: TrackedResizeObserver,
        MutationObserver: TrackedMutationObserver,
    };

    function dispose() {
        dead = true;
        timeouts.forEach((id) => window.clearTimeout(id));
        intervals.forEach((id) => window.clearInterval(id));
        frames.forEach((id) => window.cancelAnimationFrame(id));
        observers.forEach((o) => o.disconnect());
        listeners.forEach(([t, type, fn, opts]) => t.removeEventListener(type, fn, opts));
        root.querySelectorAll("video").forEach((v) => v.pause());
        // free the GPU now rather than whenever the detached canvases are garbage-collected.
        // getContext("2d") is non-null for 2D or context-less canvases, so only WebGL ones reach the second lookup.
        root.querySelectorAll("canvas").forEach((c) => {
            if (c.getContext("2d")) return;
            const gl = (c.getContext("webgl2") ?? c.getContext("webgl")) as WebGLRenderingContext | null;
            gl?.getExtension("WEBGL_lose_context")?.loseContext();
        });
    }

    return { env, dispose };
}
