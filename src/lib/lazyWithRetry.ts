import { ComponentType, lazy } from 'react';

import { isChunkLoadError, reloadForStaleApp } from '@/lib/app-update';

type LazyModule<T extends ComponentType<unknown>> = { default: T };

export function lazyWithRetry<T extends ComponentType<unknown>>(
  importer: () => Promise<LazyModule<T>>,
) {
  return lazy(async () => {
    try {
      return await importer();
    } catch (error) {
      if (isChunkLoadError(error) && reloadForStaleApp()) {
        return new Promise<LazyModule<T>>(() => undefined);
      }

      throw error;
    }
  });
}
