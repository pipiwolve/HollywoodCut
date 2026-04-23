interface StorageEnvelope<T> {
    version: number;
    data: T;
}

interface CreateLocalBoxOptions<T> {
    key: string;
    version: number;
    initialValue: () => T;
    migrate?: (raw: unknown) => T;
}

function hasWindow() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function createLocalBox<T>({ key, version, initialValue, migrate }: CreateLocalBoxOptions<T>) {
    const read = (): T => {
        if (!hasWindow()) {
            return initialValue();
        }

        const raw = window.localStorage.getItem(key);
        if (!raw) {
            return initialValue();
        }

        try {
            const parsed = JSON.parse(raw) as StorageEnvelope<T> | unknown;
            if (
                typeof parsed === 'object' &&
                parsed !== null &&
                'version' in parsed &&
                'data' in parsed &&
                typeof (parsed as StorageEnvelope<T>).version === 'number'
            ) {
                const envelope = parsed as StorageEnvelope<T>;
                if (envelope.version === version) {
                    return envelope.data;
                }
                return migrate ? migrate(envelope.data) : initialValue();
            }

            return migrate ? migrate(parsed) : initialValue();
        } catch {
            return initialValue();
        }
    };

    const write = (value: T) => {
        if (!hasWindow()) {
            return value;
        }

        const envelope: StorageEnvelope<T> = {
            version,
            data: value,
        };
        window.localStorage.setItem(key, JSON.stringify(envelope));
        return value;
    };

    const update = (updater: (current: T) => T) => write(updater(read()));

    const reset = () => write(initialValue());

    const clear = () => {
        if (hasWindow()) {
            window.localStorage.removeItem(key);
        }
    };

    return {
        key,
        read,
        write,
        update,
        reset,
        clear,
    };
}
