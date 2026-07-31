import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  APP_RELOAD_STORAGE_KEY,
  isChunkLoadError,
  isStaleAssetTarget,
  reloadForStaleApp,
  shouldReloadForRemoteBuild,
} from '@/lib/app-update';

describe('app update helpers', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('detects dynamic import chunk failures', () => {
    expect(
      isChunkLoadError(
        new TypeError('error loading dynamically imported module: https://example.com/assets/Categories.js'),
      ),
    ).toBe(true);
    expect(isChunkLoadError(new Error('network timeout'))).toBe(false);
  });

  it('detects failed app asset tags', () => {
    const script = document.createElement('script');
    script.src = 'https://www.ajynworld.com/assets/index-CaEKiA7y.js';
    expect(isStaleAssetTarget(script)).toBe(true);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://www.ajynworld.com/assets/index-yR7URw8C.css';
    expect(isStaleAssetTarget(link)).toBe(true);
    expect(isStaleAssetTarget(document.createElement('img'))).toBe(false);
  });

  it('reloads once for stale app assets', () => {
    expect(reloadForStaleApp()).toBe(true);
    expect(window.sessionStorage.getItem(APP_RELOAD_STORAGE_KEY)).toBe('1');

    expect(reloadForStaleApp()).toBe(false);
    expect(window.sessionStorage.getItem(APP_RELOAD_STORAGE_KEY)).toBeNull();
  });

  it('reloads when remote build id differs', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => 'remote-build-id',
    } as Response);

    await expect(shouldReloadForRemoteBuild('local-build-id')).resolves.toBe(true);
    await expect(shouldReloadForRemoteBuild('remote-build-id')).resolves.toBe(false);

    fetchMock.mockRestore();
  });
});
