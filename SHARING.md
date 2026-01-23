# How to Share Khafī with Your Friends 🎮

There are several ways to share your app. Choose the method that works best for you!

## Method 1: Expo Go (Quick & Easy - Best for Testing) ⚡

This is the fastest way to share with friends who have the Expo Go app installed.

### Steps:

1. **Start your development server:**
   ```bash
   npm start
   ```

2. **Share the connection:**
   - The terminal will show a QR code
   - Friends need to:
     - Install **Expo Go** app on their phone (iOS/Android)
     - Scan the QR code with their camera (iOS) or Expo Go app (Android)
     - The app will load in Expo Go

3. **For remote access (friends not on same WiFi):**
   - Press `s` in the terminal to switch to tunnel mode
   - This allows friends to connect even if they're not on your WiFi
   - Share the new QR code or link

4. **Share via link:**
   - You can also share the `exp://` link directly
   - Friends can open it in Expo Go

**Pros:** ✅ Instant, no build needed, works immediately
**Cons:** ❌ Requires Expo Go app, internet connection needed

---

## Method 2: EAS Build (Best for Production) 📱

Create installable app files (APK for Android, IPA for iOS) that friends can install directly on their phones.

### Steps:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure EAS Build:**
   ```bash
   eas build:configure
   ```

4. **Build for Android (APK - anyone can install):**
   ```bash
   eas build --platform android --profile preview
   ```
   - This creates an APK file
   - Share the download link with friends
   - They can download and install directly (no Play Store needed)

5. **Build for iOS (requires Apple Developer account):**
   ```bash
   eas build --platform ios --profile preview
   ```
   - Creates an IPA file
   - Friends need TestFlight or you need an Apple Developer account

**Pros:** ✅ Works like a real app, no Expo Go needed
**Cons:** ❌ Takes 15-30 minutes to build, requires Expo account

---

## Method 3: Internal Distribution via EAS Update (Advanced) 🚀

Create a shareable link that automatically updates when you make changes.

1. **Publish an update:**
   ```bash
   eas update --branch production
   ```

2. **Build with update channel:**
   ```bash
   eas build --platform android --profile preview --auto-submit
   ```

3. **Share the build link** - friends get a link that installs the app and auto-updates

---

## Method 4: App Stores (Best for Public Release) 🏪

Publish to the App Store and Google Play Store for everyone to download.

### Android (Google Play):

1. **Build production version:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Submit to Play Store:**
   ```bash
   eas submit --platform android
   ```

### iOS (App Store):

1. **Build production version:**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Submit to App Store:**
   ```bash
   eas submit --platform ios
   ```

**Note:** You'll need developer accounts ($99/year for Apple, $25 one-time for Google)

---

## Quick Start: Share Right Now! 🎯

**For immediate sharing (no setup needed):**

1. Run `npm start`
2. Press `s` for tunnel mode (if friends aren't on same WiFi)
3. Share the QR code or link shown in terminal
4. Friends scan with Expo Go app

**For a more permanent solution:**

1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Build Android APK: `eas build --platform android --profile preview`
4. Share the download link when build completes (~15-20 minutes)

---

## Tips 📝

- **For testing with 5-10 friends:** Use Expo Go (Method 1)
- **For sharing with many people:** Use EAS Build APK (Method 2)
- **For public release:** Use App Stores (Method 4)
- **Make sure assets folder has:** `icon.png` and `splash.png` for better builds

## Need Help?

- EAS Build docs: https://docs.expo.dev/build/introduction/
- Expo Go: https://expo.dev/client
- Expo Discord: https://chat.expo.dev/
