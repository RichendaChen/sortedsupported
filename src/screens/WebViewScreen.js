import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useFavourites } from '../context/FavouritesContext';
import { useTheme } from '../context/ThemeContext';
import { useHaptics } from '../hooks/useHaptics';
import SkeletonLoader from '../components/SkeletonLoader';

let WebViewComponent = null;
try {
  WebViewComponent = require('react-native-webview').WebView;
} catch (error) {
  WebViewComponent = null;
}

const WebViewScreen = ({ route, navigation }) => {
  const { url, title } = route.params;
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [webViewError, setWebViewError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(url);
  const { addFavourite, removeFavouriteByUrl, isFavourited } = useFavourites();
  const { theme, isDark } = useTheme();
  const { triggerMedium, triggerSuccess } = useHaptics();

  const isFavorited = isFavourited(currentUrl);

  const toggleFavourite = async () => {
    try {
      if (isFavorited) {
        triggerMedium();
        await removeFavouriteByUrl(currentUrl);
        Alert.alert('Removed', 'Page removed from favourites');
        return;
      }

      const newFav = {
        id: Date.now().toString(),
        title: title || 'Untitled Page',
        url: currentUrl,
      };
      const added = await addFavourite(newFav);
      if (added) {
        triggerSuccess();
        Alert.alert('Added', 'Page added to favourites');
      }
    } catch (error) {
      console.error('Error updating favourites:', error);
      Alert.alert('Error', 'Failed to update favourites');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={toggleFavourite}
          accessibilityRole="button"
          accessibilityLabel={isFavorited ? 'Remove from favourites' : 'Add to favourites'}
          style={{ paddingHorizontal: 8 }}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorited ? theme.danger : theme.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [isFavorited, currentUrl, theme]);

  const handleNavigationStateChange = (navState) => {
    setCurrentUrl(navState.url);
  };

  const reload = () => {
    if (webViewRef.current) {
      setWebViewError(null);
      webViewRef.current.reload();
    }
  };

  const handleError = () => {
    setWebViewError('Unable to load this page. Check your connection and try again.');
    setLoading(false);
  };

  const styles = createStyles(theme);

  if (!WebViewComponent) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="construct-outline" size={66} color={theme.subtext} />
        <Text style={styles.errorTitle}>Web view unavailable</Text>
        <Text style={styles.errorText}>
          This build does not include the in-app web viewer. Open this page in your browser, or rebuild the app
          with EAS.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          accessibilityLabel="Open page in browser"
          onPress={() => Linking.openURL(currentUrl)}
        >
          <Text style={styles.retryText}>Open in browser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (webViewError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={66} color={theme.subtext} />
          <Text style={styles.errorTitle}>Page unavailable</Text>
          <Text style={styles.errorText}>{webViewError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={reload} accessibilityLabel="Retry loading page">
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebViewComponent
        ref={webViewRef}
        source={{ uri: currentUrl }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => {
          setLoading(true);
          setWebViewError(null);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={handleError}
        onHttpError={handleError}
        injectedJavaScriptBeforeContentLoaded={`
          (function() {
            var hideSelectors = [
              'header',
              '#header',
              '#masthead',
              '.site-header',
              '.main-header-bar',
              '.elementor-location-header',
              '.navbar',
              'nav.navbar',
              '.menu-toggle',
              '.elementor-menu-toggle',
              '.wpml-ls-statics-shortcode_actions',
              '.easy-read-tab'
            ];

            function hideChrome() {
              hideSelectors.forEach(function(selector) {
                document.querySelectorAll(selector).forEach(function(el) {
                  el.style.display = 'none';
                });
              });

              var style = document.getElementById('app-webview-cleanup-style');
              if (!style) {
                style = document.createElement('style');
                style.id = 'app-webview-cleanup-style';
                style.textContent = [
                  'body { padding-top: 0 !important; margin-top: 0 !important; }',
                  'main, #content, .site-content { margin-top: 0 !important; padding-top: 0 !important; }',
                  '.hero, .page-hero, .hero-section, .banner, #hero { margin-top: 0 !important; }'
                ].join('');
                if (document.head) {
                  document.head.appendChild(style);
                }
              }
            }

            hideChrome();
            setTimeout(hideChrome, 250);
            setTimeout(hideChrome, 800);
            setTimeout(hideChrome, 1600);
            document.documentElement.style.colorScheme = '${isDark ? 'dark' : 'light'}';
          })();
          true;
        `}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <SkeletonLoader width="85%" height={18} />
            <SkeletonLoader width="95%" height={14} style={{ marginTop: 10 }} />
            <SkeletonLoader width="90%" height={14} style={{ marginTop: 10 }} />
            <SkeletonLoader width="60%" height={14} style={{ marginTop: 10 }} />
          </View>
        </View>
      )}
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    webview: {
      flex: 1,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.mode === 'dark' ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    },
    loadingCard: {
      width: '90%',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      padding: 16,
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      backgroundColor: theme.background,
    },
    errorTitle: {
      marginTop: 14,
      fontSize: 22,
      fontWeight: '700',
      color: theme.text,
    },
    errorText: {
      marginTop: 8,
      fontSize: 14,
      color: theme.subtext,
      textAlign: 'center',
      lineHeight: 20,
    },
    retryButton: {
      marginTop: 20,
      backgroundColor: theme.primary,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 18,
    },
    retryText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 16,
    },
  });

export default WebViewScreen;
