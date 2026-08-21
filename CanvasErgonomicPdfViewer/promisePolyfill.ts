interface PromiseWithResolvers<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
}

interface PromiseConstructorWithResolvers extends PromiseConstructor {
    withResolvers?: <T>() => PromiseWithResolvers<T>;
}

const PromiseCompat = Promise as PromiseConstructorWithResolvers;

if (typeof PromiseCompat.withResolvers !== "function") {
    PromiseCompat.withResolvers = function <T>(): PromiseWithResolvers<T> {
        let resolvePromise!: (value: T | PromiseLike<T>) => void;
        let rejectPromise!: (reason?: unknown) => void;

        const promise = new Promise<T>((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
        });

        return {
            promise,
            resolve: resolvePromise,
            reject: rejectPromise
        };
    };
}
