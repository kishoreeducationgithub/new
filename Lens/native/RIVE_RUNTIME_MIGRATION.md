# Rive Runtime Migration

This native folder is being migrated from the legacy / placeholder bridge to the new Nitro-based React Native runtime.

## Install

Run these commands in the real React Native app package:

```bash
npm uninstall rive-react-native
npm install @rive-app/react-native react-native-nitro-modules
```

## Requirements

- React Native `0.78+` (`0.79+` recommended for clearer Android errors)
- iOS `15.1+`
- Android SDK `24+`
- Xcode `16.4+`
- JDK `17+`
- Nitro Modules `0.25.2+`

## iOS

1. Install the packages above.
2. Open the real native app workspace and confirm the deployment target is at least `15.1`.
3. Run:

```bash
cd ios
pod install
```

4. Rebuild the app from Xcode or `npx react-native run-ios`.

## Android

1. Install the packages above.
2. Confirm:
   - `minSdkVersion >= 24`
   - JDK `17+`
3. Rebuild the app:

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

4. If Android native startup fails, inspect `RiveRuntime.getStatus()` in the debug UI.

## Metro Asset Support

The new runtime recommends `useRiveFile(require(...))` for local `.riv` files.

Make sure your `metro.config.js` includes:

```js
const { getDefaultConfig } = require('metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  config.resolver.assetExts.push('riv');
  return config;
})();
```

## Current Repo Blockers

- `Lens/native/assets/rive/toddlerGuide.riv` is not present yet in this workspace.
- There is no full `ios/` or `android/` project checked into this repo slice, so installation and rebuild steps are documented here rather than executed locally.

## Expected Runtime Contract

- File: `assets/rive/toddlerGuide.riv`
- Artboard: `ToddlerGuide`
- State machine: `ToddlerGuideMachine`
- Inputs:
  - `activityIndex`
  - `isPlaying`
  - `celebrate`
  - `calmMode`
