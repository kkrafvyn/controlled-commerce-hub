# Android Play Store Release

This repo ships AJYN as a Capacitor Android app with package ID **`com.ajyn.app`**.

## Prerequisites

- Node.js and npm
- Android Studio with Android SDK (API 36)
- A Google Play Console app created with package name **`com.ajyn.app`**
- Production `.env` values filled in before building (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, etc.)

## 1. Create the upload keystore (one time)

From the repo root in PowerShell:

```powershell
keytool -genkeypair -v `
  -keystore android/ajyn-release.keystore `
  -alias ajyn `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000
```

Copy the example signing config:

```powershell
Copy-Item android/keystore.properties.example android/keystore.properties
```

Edit `android/keystore.properties` with your real passwords. Keep the keystore file and passwords backed up safely. You need them for every Play Store update.

These files are gitignored and must never be committed.

## 2. Sync the web app into Android

```bash
npm install
npm run cap:sync
```

This builds the Vite app and copies `dist/` into the native Android project.

## 3. Test on a device or emulator

```bash
npm run cap:run:android
```

Or open Android Studio:

```bash
npm run cap:open:android
```

Verify login, browsing, cart, checkout, and Google sign-in before uploading.

## 4. Build the Play Store bundle (.aab)

After `keystore.properties` exists:

```bash
npm run cap:build:android:release
```

Output:

`android/app/build/outputs/bundle/release/app-release.aab`

You can also use Android Studio: **Build → Generate Signed App Bundle / APK**.

## 5. Upload to Google Play Console

1. Open **Testing → Internal testing** (recommended first).
2. Create a release and upload `app-release.aab`.
3. Complete store listing, privacy policy, content rating, and data safety.
4. Add yourself as an internal tester and install from the Play test link.
5. Promote to **Production** when ready.

## Auth redirects for the native app

Supabase must allow these redirect URLs (already in `supabase/config.toml`):

- `com.ajyn.app://auth`
- `https://localhost/auth`

After changing auth settings locally, add the same redirect URLs in the Supabase Dashboard under **Authentication → URL Configuration → Redirect URLs**:

- `com.ajyn.app://auth`
- `https://localhost/auth`

## Version bumps

Before each Play Store upload, increment in `android/app/build.gradle`:

- `versionCode` — integer, must increase every upload
- `versionName` — user-visible version string (e.g. `1.0.1`)

Then run `npm run cap:build:android:release` again.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Package name mismatch | Play Console and `applicationId` must both be `com.ajyn.app` |
| Unsigned release build | Create `android/keystore.properties` from the example file |
| Blank app after install | Run `npm run cap:sync` with valid production env vars |
| Google login fails on device | Confirm Supabase redirect URLs include `com.ajyn.app://auth` |
