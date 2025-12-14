export interface FormBackupOptions {
  exclude?: string[];
  ttl?: number;
  storage?: 'local' | 'session';
}

interface StoragePayload {
  data: Record<string, unknown>;
  timestamp: number;
}

/**
 * Creates and returns a FormBackup API object
 *
 * @example
 * ```typescript
 * const backup = createFormBackup('signup-form', {
 *   exclude: ['password'],
 *   ttl: 30 * 60 * 1000
 * })
 *
 * backup.save({ name: 'John', email: 'agetbase@google.com' })
 * const data = backup.restore()
 * ```
 */
export function createFormBackup(
  formId: string,
  options: FormBackupOptions = {}
) {
  if (!formId) {
    throw new Error('FormBackup: formId is required');
  }

  if (typeof window === 'undefined') {
    console.warn('FormBackup: Browser environment required');

    return {
      save: () => false,
      restore: () => null,
      clear: () => false,
      exists: () => false,
      getRemainingTTL: () => null,
    };
  }

  const storageKey = `form-backup-${formId}`;
  const exclude = options.exclude || [];
  const ttl = options.ttl || null;
  const storageType =
    options.storage === 'local' ? 'localStorage' : 'sessionStorage';

  if (!window[storageType]) {
    throw new Error(`FormBackup: ${storageType} is not available`);
  }

  const storage = window[storageType];

  return {
    save(data: Record<string, unknown>): boolean {
      try {
        const filteredData = { ...data };
        exclude.forEach((field) => {
          delete filteredData[field];
        });

        const payload: StoragePayload = {
          data: filteredData,
          timestamp: Date.now(),
        };

        storage.setItem(storageKey, JSON.stringify(payload));
        return true;
      } catch (error) {
        console.error('FormBackup: Save failed', error);
        return false;
      }
    },

    restore(): Record<string, unknown> | null {
      try {
        const saved = storage.getItem(storageKey);
        if (!saved) return null;

        const payload: StoragePayload = JSON.parse(saved);

        if (ttl && payload.timestamp) {
          const elapsed = Date.now() - payload.timestamp;
          if (elapsed > ttl) {
            this.clear();
            return null;
          }
        }

        return payload.data;
      } catch (error) {
        console.error('FormBackup: Restore failed', error);
        return null;
      }
    },

    clear(): boolean {
      try {
        storage.removeItem(storageKey);
        return true;
      } catch (error) {
        console.error('FormBackup: Clear failed', error);
        return false;
      }
    },

    exists(): boolean {
      try {
        return storage.getItem(storageKey) !== null;
      } catch {
        return false;
      }
    },

    getRemainingTTL(): number | null {
      if (!ttl) return null;

      try {
        const saved = storage.getItem(storageKey);
        if (!saved) return null;

        const payload: StoragePayload = JSON.parse(saved);
        const elapsed = Date.now() - payload.timestamp;
        const remaining = ttl - elapsed;

        return remaining > 0 ? remaining : 0;
      } catch {
        return null;
      }
    },
  };
}

export type FormBackup = ReturnType<typeof createFormBackup>;
