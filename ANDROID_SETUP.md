# Android Setup Guide for React Native

## Do You Need Android Studio?

### Quick Answer:
- **iOS Development Only**: ❌ Not Required
- **Android Development**: ✅ Required

## Current Status

### ✅ What's Already Working:
1. **react-native-config** is properly configured for Android
2. **Environment variables** will be accessible when Android SDK is installed
3. **All iOS functionality** works without Android Studio

### ⚠️ What's Missing (Android Only):
- Android SDK location (requires Android Studio)
- Android build tools
- Android emulator

## Installation Guide (If Needed)

### Prerequisites for Android Development:

1. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - During installation, make sure to install:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device

2. **Set Environment Variables**
   ```bash
   # Add to ~/.zshrc or ~/.bash_profile
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **Create local.properties**
   ```bash
   cd android
   echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties
   ```

4. **Install Java JDK** (if not installed)
   ```bash
   brew install --cask adoptopenjdk/openjdk/adoptopenjdk11
   ```

## Testing Android Builds

Once Android Studio is installed:

```bash
# Clean build
cd android && ./gradlew clean

# Run on Android emulator
npx react-native run-android

# Run on specific device
npx react-native run-android --deviceId="device_id"
```

## Environment Variables on Android

Your `.env` files will work on Android once the SDK is installed:
- `.env.development` - Used by default
- `.env.production` - Used with release builds
- `.env.staging` - Used with `ENVFILE=.env.staging`

## Troubleshooting

### SDK Location Error
If you see "SDK location not found":
1. Install Android Studio
2. Set ANDROID_HOME environment variable
3. Create `android/local.properties` with SDK path

### Build Failures
```bash
# Clean everything
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
cd ios && pod install
```

## iOS-Only Development

If you're only developing for iOS:
1. Ignore Android-related errors
2. Use `npx react-native run-ios` exclusively
3. Environment variables still work on iOS
4. No Android Studio needed

## Verification

To verify your setup works:
1. Check console logs for configuration output
2. Look for the environment badge (green for DEVELOPMENT)
3. API calls should use the correct base URL from `.env` files 