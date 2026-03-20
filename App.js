import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import FavouritesScreen from './src/screens/FavouritesScreen';
import ShareScreen from './src/screens/ShareScreen';
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
    </Stack.Navigator>
  );
}

function AppContent() {
  const { isDark } = useTheme();

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

function App() {
  return (
    <ThemeProvider>
      <FavouritesProvider>
        <AppContent />
      </FavouritesProvider>
    </ThemeProvider>
  );
}

export default App;
