import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GameProvider } from "@/contexts/GameContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Home } from 'lucide-react-native';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function HomeButton() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => router.replace('/')}
      style={{ marginRight: 4, padding: 6 }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      testID="header-home-btn"
    >
      <Home size={20} color={colors.text} />
    </TouchableOpacity>
  );
}

function RootLayoutNav() {
  const { colors, isDark } = useTheme();
  return (
    <>
    <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' as const, color: colors.text },
        contentStyle: { backgroundColor: colors.background },
        headerTransparent: true,
        headerBlurEffect: isDark ? 'dark' : undefined,
        headerRight: () => <HomeButton />,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="puzzle-select" options={{ title: 'Puzzles' }} />
      <Stack.Screen name="puzzle" options={{ title: 'Kanji Challenge' }} />
      <Stack.Screen name="sudoku" options={{ title: 'Sudoku' }} />
      <Stack.Screen name="mini-games" options={{ title: 'Mini Games' }} />
      <Stack.Screen name="mini-game" options={{ title: 'Word Match' }} />
      <Stack.Screen name="trivia" options={{ title: 'Trivia' }} />
      <Stack.Screen name="companion" options={{ title: 'Reina' }} />
      <Stack.Screen name="study-list" options={{ title: 'Study List' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="shop" options={{ title: 'Shop' }} />
    </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
    if (Platform.OS !== 'web') {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <ThemeProvider>
          <GameProvider>
            <RootLayoutNav />
          </GameProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
