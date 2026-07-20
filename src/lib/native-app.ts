import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export const APP_PACKAGE_ID = 'com.ajyn.app';

export function isNativeAppRuntime() {
  return Capacitor.isNativePlatform();
}

export function getNativeOAuthRedirectUrl() {
  return `${APP_PACKAGE_ID}://auth`;
}

export function getWebOAuthRedirectUrl() {
  if (typeof window === 'undefined') {
    return '/auth';
  }

  const currentUrl = new URL(window.location.href);
  const callbackUrl = new URL('/auth', currentUrl.origin);
  callbackUrl.hash = '';

  if (currentUrl.pathname === '/auth') {
    callbackUrl.search = currentUrl.search;
  }

  return callbackUrl.toString();
}

export function getOAuthRedirectUrl() {
  return isNativeAppRuntime() ? getNativeOAuthRedirectUrl() : getWebOAuthRedirectUrl();
}

function extractAuthCallbackSuffix(url: string) {
  const hashIndex = url.indexOf('#');
  if (hashIndex >= 0) {
    return url.slice(hashIndex);
  }

  const queryIndex = url.indexOf('?');
  if (queryIndex >= 0) {
    return url.slice(queryIndex);
  }

  return '';
}

export function installNativeAuthDeepLinkHandler() {
  if (!isNativeAppRuntime()) {
    return () => undefined;
  }

  const listener = App.addListener('appUrlOpen', ({ url }) => {
    if (!url.includes('://auth')) {
      return;
    }

    const suffix = extractAuthCallbackSuffix(url);
    window.location.replace(`/auth${suffix}`);
  });

  return () => {
    void listener.then((handle) => handle.remove());
  };
}
