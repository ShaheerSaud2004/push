# App Store Update (v1.1.0)

## What's in this update
- **Discussion timer**: After round instructions, tap "Proceed to Timer" for a countdown based on group size. Use "+30 sec" for extra time, then "Reveal When Ready."
- **Play Again**: New round gets a new imposter, new category, and new word (no repeats).
- **How to Play**: Updated with timer steps.

## Version
- **App version**: 1.1.0  
- **iOS build number**: 5  

## Submit to App Store

1. **Install EAS CLI** (if needed):
   ```bash
   npm install -g eas-cli
   ```

2. **Log in to Expo**:
   ```bash
   eas login
   ```

3. **Build for iOS (production)**:
   ```bash
   eas build --platform ios --profile production
   ```
   Wait for the build to finish on Expo’s servers. You’ll get a build URL and, when it’s done, an `.ipa` link.

4. **Submit the latest build to App Store Connect**:
   ```bash
   eas submit --platform ios --profile production --latest
   ```
   When prompted:
   - Choose the **latest** build (or the build id from step 3).
   - Use your **Apple ID** and **App-specific password** (or asc-app-specific password) for App Store Connect API key if you use one.

5. **In App Store Connect**:
   - Open your app → **TestFlight** to see the new build.
   - When ready, create a new **version 1.1.0** (if needed), select build **5**, add “What’s New” (e.g. “Discussion timer, improved Play Again randomness”), then submit for review.

## Optional: auto-increment build
`eas.json` has `"autoIncrement": true` for production, so EAS can bump the build number for you on each production build. The version (1.1.0) and build number (5) in `app.json` are already set for this release.
