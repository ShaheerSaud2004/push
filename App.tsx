import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { GameProvider } from './contexts/GameContext';
import MenuScreen from './screens/MenuScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import SettingsScreen from './screens/SettingsScreen';
import GameSetupScreen from './screens/GameSetupScreen';
import PassAndPlayScreen from './screens/PassAndPlayScreen';
import RoundInstructionsScreen from './screens/RoundInstructionsScreen';
import RevealScreen from './screens/RevealScreen';
import CreateCategoryScreen from './screens/CreateCategoryScreen';
import UpgradeScreen from './screens/UpgradeScreen';

export type RootStackParamList = {
  Menu: undefined;
  HowToPlay: undefined;
  Settings: undefined;
  GameSetup: undefined;
  PassAndPlay: undefined;
  RoundInstructions: undefined;
  Reveal: undefined;
  CreateCategory: undefined;
  Upgrade: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppContent() {
  const { theme } = useTheme();
  
  // Determine StatusBar style based on theme
  // 'dark' theme uses light content, others use dark content
  const statusBarStyle = theme === 'dark' ? 'light' : 'dark';

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
            animationEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="GameSetup" component={GameSetupScreen} />
          <Stack.Screen name="PassAndPlay" component={PassAndPlayScreen} />
          <Stack.Screen
            name="RoundInstructions"
            component={RoundInstructionsScreen}
          />
          <Stack.Screen name="Reveal" component={RevealScreen} />
          <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} />
          <Stack.Screen name="Upgrade" component={UpgradeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style={statusBarStyle} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GameProvider>
          <AppContent />
        </GameProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}