import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const WebViewScreen = ({ route, navigation }) => {
  const { url, title } = route.params;
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [loading, setLoading] = useState(true);
  const webViewRef = React.useRef(null);

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  const goBack = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  const goForward = () => {
    if (webViewRef.current && canGoForward) {
      webViewRef.current.goForward();
    }
  };

  const reload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <View style={styles.container}>
      {/* Navigation Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          onPress={goBack} 
          disabled={!canGoBack}
          style={styles.controlButton}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={canGoBack ? '#5B6FA8' : '#CCC'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={goForward} 
          disabled={!canGoForward}
          style={styles.controlButton}
        >
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color={canGoForward ? '#5B6FA8' : '#CCC'} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={reload}
          style={styles.controlButton}
        >
          <Ionicons name="reload" size={24} color="#5B6FA8" />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5B6FA8" />
          </View>
        )}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5B6FA8" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  controls: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    justifyContent: 'flex-start',
  },
  controlButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default WebViewScreen;
