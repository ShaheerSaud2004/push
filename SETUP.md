# Khafī Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - Install Expo Go app on your iOS/Android device
   - Scan the QR code from the terminal
   - Or press `i` for iOS simulator, `a` for Android emulator

## Assets Required

You'll need to add the following assets to the `assets/` folder:

- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen (1242x2436)
- `adaptive-icon.png` - Android adaptive icon (1024x1024)
- `favicon.png` - Web favicon (48x48)

For now, the app will work without these, but they're needed for production builds.

## Features Implemented

✅ Three UI themes (Soft Islamic Geometry, Paper Card Texture, Dark Ink/Warm Majlis)
✅ Complete game flow (Menu → Setup → Pass-and-Play → Round → Reveal)
✅ Standard, Blind Imposter, and Double Agent game modes
✅ Islamic-themed categories with descriptions
✅ Custom category support (persisted locally)
✅ Settings persistence (theme, unlocked categories)
✅ Haptics and smooth animations
✅ Card-based UI with ceremonial reveal ritual
✅ Double-tap or long-press to reveal
✅ Progress indicators
✅ Endgame twist (imposter guess)

## Project Structure

```
muslimimposter/
├── App.tsx                 # Main app entry with navigation
├── components/             # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── PatternBackground.tsx
├── contexts/              # React contexts
│   ├── GameContext.tsx
│   └── ThemeContext.tsx
├── data/                  # Seed data
│   └── categories.ts
├── screens/               # All app screens
│   ├── MenuScreen.tsx
│   ├── HowToPlayScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── GameSetupScreen.tsx
│   ├── PassAndPlayScreen.tsx
│   ├── RoundInstructionsScreen.tsx
│   └── RevealScreen.tsx
├── theme/                 # Theme system
│   └── index.ts
├── types/                 # TypeScript types
│   └── index.ts
└── utils/                 # Utility functions
    ├── game.ts
    └── storage.ts
```

## Testing the App

1. Start a new game from the Menu
2. Set up players (3-20), imposters, and select categories
3. Pass the phone to each player - they'll double-tap or long-press to reveal
4. Follow the round instructions
5. Reveal results and play the endgame twist

## Notes

- All game state is stored locally using AsyncStorage
- No backend required
- Works offline
- Theme changes persist across app restarts
- Custom categories are saved locally

Enjoy playing Khafī! 🎮