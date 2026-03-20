import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useFavourites } from '../context/FavouritesContext';
import { useTheme } from '../context/ThemeContext';
import { useHaptics } from '../hooks/useHaptics';
import SkeletonLoader from '../components/SkeletonLoader';

const WebViewScreen = ({ route }) => {
  const { url, title } = route.params;
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [loading, setLoading] = useState(true);
  const [webViewError, setWebViewError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(url);
  const { addFavourite, removeFavouriteByUrl, isFavourited } = useFavourites();
  const { theme, isDark } = useTheme();
  const { triggerLight, triggerMedium, triggerSuccess } = useHaptics();

  const isFavorited = useMemo(() => isFavourited(currentUrl), [currentUrl, isFavourited]);

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

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
  };

  const goBack = () => {
    if (webViewRef.current && canGoBack) {
      triggerLight();
      webViewRef.current.goBack();
    }
  };

  const goForward = () => {
    if (webViewRef.current && canGoForward) {
      triggerLight();
      webViewRef.current.goForward();
    }
  };

  const reload = () => {
    if (webViewRef.current) {
      setWebViewError(null);
      triggerLight();
      webViewRef.current.reload();
    }
  };

  const handleError = () => {
    setWebViewError('Unable to load this page. Check your connection and try again.');
    setLoading(false);
  };

  const styles = createStyles(theme);

  if (webViewError) {
    return (
      <View style={styles.container}>
        <View style={styles.controls}>
          <TouchableOpacity onPress={reload} style={styles.controlButton} accessibilityLabel="Retry page load">
            <Ionicons name="reload" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
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
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={goBack}
          disabled={!canGoBack}
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={canGoBack ? theme.primary : theme.subtext} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goForward}
          disabled={!canGoForward}
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel="Go forward"
        >
          <Ionicons
            name="arrow-forward"
            size={24}
            color={canGoForward ? theme.primary : theme.subtext}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={reload}
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel="Reload page"
        >
          <Ionicons name="reload" size={24} color={theme.primary} />
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          onPress={toggleFavourite}
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel={isFavorited ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorited ? theme.danger : theme.primary}
          />
        </TouchableOpacity>
      </View>

      <WebView
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
        injectedJavaScript={
          isDark
            ? "document.documentElement.style.colorScheme = 'dark'; true;"
            : "document.documentElement.style.colorScheme = 'light'; true;"
        }
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
    controls: {
      flexDirection: 'row',
      backgroundColor: theme.background,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      justifyContent: 'flex-start',
    },
    controlButton: {
      paddingHorizontal: 15,
      paddingVertical: 5,
    },
    webview: {
      flex: 1,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 54,
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
