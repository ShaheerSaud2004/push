# App Store Submission Guide for Khafī 🍎

Quick step-by-step guide to get your app on the Apple App Store.

## ✅ Prerequisites Checklist

- [x] Apple Developer Account ($99/year) - You have this!
- [ ] Expo account (free) - Sign up at https://expo.dev
- [ ] EAS CLI installed
- [ ] App configured (app.json updated with buildNumber)

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

## Step 2: Login to Expo

```bash
eas login
```

If you don't have an Expo account, create one (it's free).

## Step 3: Link Your Project

```bash
eas build:configure
```

This will ask if you want to create a new project or link to existing one. Choose "Create a new project" if this is your first time.

## Step 4: Build Your iOS App

```bash
eas build --platform ios --profile production
```

**What happens:**
1. EAS will ask you to connect your Apple Developer account
2. You'll need to provide your Apple ID and password
3. It will create certificates and provisioning profiles automatically
4. Build takes ~20-30 minutes in the cloud
5. You'll get a download link when done

**Important:** Make sure you're logged into the same Apple ID that has your Developer account.

## Step 5: Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click **"My Apps"** → **"+"** → **"New App"**
3. Fill in:
   - **Platform:** iOS
   - **Name:** Khafī
   - **Primary Language:** English
   - **Bundle ID:** Select `com.khafi.app` (or create it if it doesn't exist)
   - **SKU:** `khafi-app` (any unique identifier)
   - **User Access:** Full Access (or Limited if you have a team)

## Step 6: Prepare App Store Listing

You'll need to fill in:

### Required Information:
- **App Name:** Khafī
- **Subtitle:** (optional) A fun party game for Muslims
- **Description:** Write a compelling description of your game
- **Keywords:** (comma-separated) e.g., "muslim, islamic, party game, imposter, social"
- **Support URL:** (required) Your website or support page
- **Marketing URL:** (optional) Your website
- **Privacy Policy URL:** (required) Link to your privacy policy

### Required Assets:
- **App Icon:** 1024x1024px (you have this in assets/icon.png)
- **Screenshots:** 
  - iPhone 6.7" Display (1290 x 2796 pixels) - At least 1, up to 10
  - iPhone 6.5" Display (1242 x 2688 pixels) - At least 1, up to 10
  - iPhone 5.5" Display (1242 x 2208 pixels) - At least 1, up to 10
- **App Preview:** (optional) Video previews

### App Information:
- **Category:** Games → Party Games (or Social)
- **Age Rating:** Complete the questionnaire (likely 4+ or 9+)
- **Price:** Free (or set a price)

## Step 7: Submit Your Build

### Option A: Automatic (Recommended)

```bash
eas submit --platform ios
```

This will:
- Find your latest production build
- Upload it to App Store Connect
- Link it to your app

### Option B: Manual

1. Download the `.ipa` file from your EAS build page
2. Open **Transporter** app (free from Mac App Store) or **Xcode**
3. Upload the `.ipa` file
4. Go to App Store Connect → Your App → TestFlight/App Store
5. Select the build and submit

## Step 8: Submit for Review

1. In App Store Connect, go to your app
2. Click **"Prepare for Submission"** or **"Submit for Review"**
3. Complete any missing information
4. Answer export compliance questions
5. Click **"Submit for Review"**

## Step 9: Wait for Review

- **Typical review time:** 1-3 days
- **First submission:** May take longer (up to 7 days)
- You'll get email notifications about status changes

## Common Issues & Solutions

### Issue: "Bundle ID not found"
**Solution:** Create the Bundle ID in Apple Developer Portal first:
1. Go to https://developer.apple.com/account
2. Certificates, Identifiers & Profiles → Identifiers
3. Click "+" → App IDs
4. Register `com.khafi.app`

### Issue: "Missing compliance information"
**Solution:** Answer the export compliance questions in App Store Connect. For most apps, answer "No" to encryption questions unless you use specific encryption.

### Issue: "Missing privacy policy"
**Solution:** You need a privacy policy URL. You can:
- Host it on your website
- Use a free service like GitHub Pages
- Create a simple privacy policy

### Issue: "Missing screenshots"
**Solution:** Take screenshots on a real device or simulator:
1. Run your app in iOS Simulator
2. Take screenshots (Cmd + S)
3. Resize to required dimensions if needed

## Quick Command Reference

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios

# Check build status
eas build:list

# View build details
eas build:view [BUILD_ID]
```

## What's Next?

After your app is approved:
1. **Monitor reviews** - Respond to user feedback
2. **Track analytics** - Use App Store Connect analytics
3. **Update regularly** - Use `eas update` for quick JS updates
4. **Build new versions** - Increment buildNumber for native changes

## Need Help?

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **App Store Connect Help:** https://help.apple.com/app-store-connect/
- **Expo Discord:** https://chat.expo.dev

Good luck! 🚀
