# Publishing Khafī to App Stores 📱

Complete guide for publishing to iOS App Store and Google Play Store, plus how updates work.

---

## Prerequisites

### For iOS (App Store):
- ✅ **Apple Developer Account** ($99/year)
  - Sign up at: https://developer.apple.com
  - Required for App Store publishing

### For Android (Play Store):
- ✅ **Google Play Developer Account** ($25 one-time)
  - Sign up at: https://play.google.com/console
  - One-time payment, lifetime access

### For Both:
- ✅ **Expo Account** (free)
  - Sign up at: 
  - Used for EAS Build service

---

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

---

## Step 2: Login to Expo

```bash
eas login
```

Create an account if you don't have one (it's free).

---

## Step 3: Configure Your App

### Update app.json/app.config.js

Make sure your app information is correct:

```json
{
  "expo": {
    "name": "Khafī",
    "slug": "khafi",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.khafi.app",  // Must be unique
      "buildNumber": "1"
    },
    "android": {
      "package": "com.khafi.app",  // Must be unique
      "versionCode": 1
    }
  }
}
```

**Important:** Change `com.khafi.app` to something unique like `com.yourname.khafi` or `com.yourcompany.khafi`

---

## Step 4: Configure EAS Build

```bash
eas build:configure
```

This creates an `eas.json` file with build profiles.

---

## Step 5: Prepare Assets

You need these images in the `assets/` folder:

### Required:
- `icon.png` - 1024x1024px (App icon)
- `splash.png` - 1242x2436px (Splash screen)

### Optional but recommended:
- `adaptive-icon.png` - 1024x1024px (Android)
- `favicon.png` - 48x48px (Web)

**Tip:** Use a tool like [App Icon Generator](https://www.appicon.co) to generate all sizes automatically.

---

## Publishing to iOS App Store 🍎

### Step 1: Build for iOS

```bash
eas build --platform ios --profile production
```

This will:
- Ask you to connect your Apple Developer account
- Build your app in the cloud (~20-30 minutes)
- Create an `.ipa` file ready for App Store

### Step 2: Submit to App Store

**Option A: Automatic (Recommended)**
```bash
eas submit --platform ios
```

**Option B: Manual**
1. Download the `.ipa` from the build page
2. Use Xcode or Transporter app to upload
3. Go to App Store Connect to complete submission

### Step 3: App Store Connect Setup

1. Go to https://appstoreconnect.apple.com
2. Create a new app:
   - Name: Khafī
   - Primary Language: English
   - Bundle ID: (the one you set in app.json)
   - SKU: (any unique identifier)

3. Fill in app information:
   - Description
   - Screenshots (required)
   - App icon
   - Privacy policy URL
   - Category: Games
   - Age rating

4. Submit for review

**Review time:** Usually 1-3 days

---

## Publishing to Google Play Store 🤖

### Step 1: Build for Android

```bash
eas build --platform android --profile production
```

This creates an `.aab` (Android App Bundle) file (~15-20 minutes).

### Step 2: Create Play Store Listing

1. Go to https://play.google.com/console
2. Create a new app:
   - App name: Khafī
   - Default language: English
   - App or game: Game
   - Free or paid: Free

3. Fill in store listing:
   - Short description (80 chars)
   - Full description (4000 chars)
   - Screenshots (required)
   - App icon
   - Feature graphic
   - Privacy policy URL

### Step 3: Upload Build

1. Go to "Production" → "Create new release"
2. Upload the `.aab` file from your EAS build
3. Add release notes
4. Review and roll out

**Review time:** Usually 1-7 days (first time), faster for updates

---

## How Updates Work 🔄

### Method 1: EAS Update (Recommended - Fast Updates)

**For code changes (no native changes):**

1. **Make your changes** to JavaScript/TypeScript code

2. **Publish an update:**
   ```bash
   eas update --branch production --message "Fixed bug in game setup"
   ```

3. **Users get the update automatically** when they open the app (within seconds/minutes)

**Benefits:**
- ✅ No app store review needed
- ✅ Updates appear instantly
- ✅ Works for JavaScript/TypeScript changes
- ✅ No need to rebuild

**Limitations:**
- ❌ Can't update native code (new dependencies, native modules)
- ❌ Can't change app.json config (version, permissions, etc.)

### Method 2: Full App Store Update

**For native changes or major updates:**

1. **Update version numbers:**
   ```json
   {
     "version": "1.0.1",  // User-facing version
     "ios": {
       "buildNumber": "2"  // Increment for each build
     },
     "android": {
       "versionCode": 2  // Increment for each build
     }
   }
   ```

2. **Build new version:**
   ```bash
   eas build --platform ios --profile production
   eas build --platform android --profile production
   ```

3. **Submit to stores:**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

4. **Users update via App Store/Play Store** (requires review)

---

## Update Workflow Examples

### Scenario 1: Bug Fix (JavaScript)
```bash
# Fix the bug in your code
# Then publish update
eas update --branch production --message "Fixed card reveal bug"

# Users get update automatically, no review needed!
```

### Scenario 2: New Feature (JavaScript only)
```bash
# Add new feature
# Publish update
eas update --branch production --message "Added new category"

# Users get update automatically!
```

### Scenario 3: New Native Dependency
```bash
# Added expo-camera or other native module
# Must rebuild
npm install expo-camera
eas build --platform all --profile production
eas submit --platform all

# Users update via app stores (review required)
```

### Scenario 4: Version Bump
```bash
# Update version in app.json
# Build and submit
eas build --platform all --profile production
eas submit --platform all

# Users update via app stores
```

---

## Best Practices

### Version Numbering:
- **Version (1.0.0):** User-facing version (semantic versioning)
  - Major.Minor.Patch
  - 1.0.0 → 1.0.1 (bug fix)
  - 1.0.1 → 1.1.0 (new feature)
  - 1.1.0 → 2.0.0 (major change)

- **Build Number / Version Code:** Increment for every build
  - iOS: buildNumber (1, 2, 3...)
  - Android: versionCode (1, 2, 3...)

### Update Strategy:
1. **Use EAS Update** for quick fixes and features (no review)
2. **Use Full Build** for major changes or native updates
3. **Test updates** on a development branch first

### Testing Before Publishing:
```bash
# Build preview version for testing
eas build --platform ios --profile preview

# Share link with testers
# They can install and test before you publish
```

---

## Cost Breakdown

### One-Time Costs:
- Google Play: $25 (one-time)
- Apple Developer: $99/year

### Ongoing Costs:
- EAS Build: Free tier includes some builds/month
- EAS Update: Free for unlimited updates
- App Store: $99/year (Apple only)

---

## Quick Start Commands

```bash
# Initial setup
npm install -g eas-cli
eas login
eas build:configure

# Build for production
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android

# Quick update (no review)
eas update --branch production --message "Your update message"
```

---

## Troubleshooting

### Build fails?
- Check `eas.json` configuration
- Ensure all assets are present
- Check Expo documentation for your Expo SDK version

### Submission rejected?
- Check store guidelines
- Ensure privacy policy is linked
- Review app store requirements

### Updates not showing?
- Check update branch matches
- Ensure users have latest build installed
- Check EAS Update dashboard

---

## Resources

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **EAS Update Docs:** https://docs.expo.dev/eas-update/introduction/
- **App Store Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Play Store Policies:** https://play.google.com/about/developer-content-policy/

---

## Next Steps

1. ✅ Create developer accounts (Apple + Google)
2. ✅ Install EAS CLI
3. ✅ Configure your app
4. ✅ Prepare assets (icon, splash)
5. ✅ Build and submit!

Good luck with your launch! 🚀
