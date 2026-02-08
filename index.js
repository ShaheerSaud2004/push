import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';

// Keep native splash visible until we hide it (avoids green box / "Building" flash)
SplashScreen.preventAutoHideAsync().catch(() => {});

import App from './App';

registerRootComponent(App);