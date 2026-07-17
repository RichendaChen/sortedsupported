import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import FavouritesScreen from './src/screens/FavouritesScreen';
import ShareScreen from './src/screens/ShareScreen';
import UrgentHelpScreen from './src/screens/UrgentHelpScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { FavouritesProvider } from './src/context/FavouritesContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="WebView" 
        component={WebViewScreen}
        options={{ 
          headerShown: true,
          title: 'SortedSupported'
        }}
      />
      <Stack.Screen
        name="UrgentHelp"
        component={UrgentHelpScreen}
        options={{
          headerShown: true,
          title: 'Need urgent help?',
        }}
      />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { isDark, textScale } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS !== 'web' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/service-worker.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  }, []);

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: '#8FA0D8',
          background: '#121212',
          card: '#1E1E1E',
          text: '#E0E0E0',
          border: '#333333',
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: '#5B6FA8',
          background: '#F5F5F5',
          card: '#FFFFFF',
          text: '#333333',
          border: '#E0E0E0',
        },
      };

  // On Android with 3-button navigation, bottom insets are usually larger than gesture mode.
  const showAndroidNavSpacer = Platform.OS === 'android' && insets.bottom >= 24;
  const androidNavSpacerHeight = showAndroidNavSpacer ? insets.bottom : 0;
  const androidNavSpacerColor = isDark ? '#111111' : '#1D2433';
  const tabBaseHeight = 60;

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Favourites') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Share') {
              iconName = focused ? 'share-social' : 'share-social-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#5B6FA8',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {
            fontSize: 13 * textScale,
            paddingBottom: 2,
          },
          tabBarStyle: {
            height: tabBaseHeight + androidNavSpacerHeight,
            paddingTop: 6,
            paddingBottom: 6 + androidNavSpacerHeight,
            backgroundColor: themeColorForTab(isDark),
            borderTopColor: isDark ? '#333333' : '#E0E0E0',
            borderTopWidth: 1,
          },
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: themeColorForTab(isDark) }}>
              {showAndroidNavSpacer ? (
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: androidNavSpacerHeight,
                    backgroundColor: androidNavSpacerColor,
                  }}
                />
              ) : null}
            </View>
          ),
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Favourites" component={FavouritesScreen} />
        <Tab.Screen name="Share" component={ShareScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const themeColorForTab = (isDark) => (isDark ? '#1E1E1E' : '#FFFFFF');

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FavouritesProvider>
          <AppContent />
        </FavouritesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
