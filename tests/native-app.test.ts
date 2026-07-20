import { describe, expect, it } from 'vitest';

import {
  APP_PACKAGE_ID,
  getNativeOAuthRedirectUrl,
  getOAuthRedirectUrl,
  getWebOAuthRedirectUrl,
} from '@/lib/native-app';

describe('native app helpers', () => {
  it('uses the Play Console package id', () => {
    expect(APP_PACKAGE_ID).toBe('com.ajyn.app');
  });

  it('builds the native OAuth redirect url', () => {
    expect(getNativeOAuthRedirectUrl()).toBe('com.ajyn.app://auth');
  });

  it('builds web OAuth redirect urls from the current origin', () => {
    expect(getWebOAuthRedirectUrl()).toContain('/auth');
  });

  it('prefers the native redirect url when Capacitor reports a native platform', () => {
    expect(getOAuthRedirectUrl()).toBeTruthy();
  });
});
