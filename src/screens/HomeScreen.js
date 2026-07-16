import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  Switch,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { Search, Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useHaptics } from '../hooks/useHaptics';

const logoImage = require('../../assets/icon.png');

const BASE_CATEGORIES = [
  {
    id: '1',
    title: "What's in Swansea,\nNeath Port Talbot for me",
    url: 'https://www.sortedsupported.org.uk/',
    icon: 'location',
    backgroundColor: '#C8E6F5',
    iconColor: '#FF8C42',
  },
  {
    id: '2',
    title: 'Coping with Common Issues',
    url: 'https://www.sortedsupported.org.uk/coping-with-common-issues/',
    icon: 'bulb',
    backgroundColor: '#F5D5E0',
    iconColor: '#FFA500',
  },
  {
    id: '3',
    title: 'Professionals',
    url: 'https://www.sortedsupported.org.uk/im-a-professional/',
    icon: 'briefcase',
    backgroundColor: '#D5DAED',
    iconColor: '#6B7AA1',
  },
];

const HomeScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { triggerLight } = useHaptics();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [textScale, setTextScale] = useState(1);

  const appVersion =
    Application.nativeApplicationVersion ||
    Constants.expoConfig?.version ||
    Constants.manifest?.version ||
    'Unknown';
  const buildNumber =
    Application.nativeBuildVersion ||
    Constants.expoConfig?.ios?.buildNumber ||
    Constants.expoConfig?.android?.versionCode ||
    null;

  const displayTextScale = useMemo(() => Math.round(16 * textScale), [textScale]);

  useEffect(() => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setSearchResults([]);
      setSearchError(false);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(false);

      try {
        const endpoint =
          'https://www.sortedsupported.org.uk/wp-json/wp/v2/pages?search=' +
          encodeURIComponent(trimmed) +
          '&per_page=10';
        const response = await fetch(endpoint, { signal: controller.signal });

        if (!response.ok) {
          throw new Error('Search request failed');
        }

        const data = await response.json();
        const mapped = (Array.isArray(data) ? data : [])
          .map((item) => ({
            id: String(item.id),
            title: (item.title?.rendered || 'Untitled page')
              .replace(/<[^>]*>/g, '')
              .trim(),
            url: item.link,
            excerpt: (item.excerpt?.rendered || '').replace(/<[^>]*>/g, '').trim(),
          }))
          .filter((item) => item.url);

        setSearchResults(mapped);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSearchError(true);
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery]);

  const handleCategoryPress = (category) => {
    triggerLight();
    const separator = category.url.includes('?') ? '&' : '?';
    const urlWithUTM = `${category.url}${separator}utm_source=app&utm_medium=mobile&utm_campaign=app`;
    navigation.navigate('WebView', { url: urlWithUTM, title: category.title.replace('\n', ' ') });
  };

  const handleSearchResultPress = (result) => {
    triggerLight();
    const separator = result.url.includes('?') ? '&' : '?';
    const urlWithUTM = `${result.url}${separator}utm_source=app&utm_medium=mobile&utm_campaign=app_search`;
    navigation.navigate('WebView', { url: urlWithUTM, title: result.title });
  };

  const hasQuery = Boolean(searchQuery.trim());

  const decreaseTextSize = () => {
    triggerLight();
    setTextScale((prev) => Math.max(0.8, Number((prev - 0.1).toFixed(2))));
  };

  const increaseTextSize = () => {
    triggerLight();
    setTextScale((prev) => Math.min(1.5, Number((prev + 0.1).toFixed(2))));
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <View style={styles.topBarBrand}>
            <View style={styles.logoWrap}>
              <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
            </View>
            <View>
              <Text style={styles.topBarTitle}>SortedSupported</Text>
              <Text style={styles.topBarSubtitle}>Emotional wellbeing support</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.topBarMenuButton}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons name="menu" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrap}>
          <Search size={18} color={theme.subtext} strokeWidth={2.2} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for pages or support..."
            placeholderTextColor={theme.subtext}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search for pages or support"
          />
          {isSearching ? <ActivityIndicator size="small" color={theme.primary} /> : null}
        </View>

        <View style={styles.categoriesContainer}>
          {!hasQuery
            ? BASE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
                  onPress={() => handleCategoryPress(category)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${category.title.replace(/\n/g, ' ')}`}
                >
                  <View style={styles.categoryContent}>
                    <View style={styles.iconContainer}>
                      {category.icon === 'location' && (
                        <View style={styles.locationIconContainer}>
                          <View style={styles.locationPin}>
                            <Ionicons name="location" size={30} color="white" />
                          </View>
                          <View style={styles.locationBase} />
                        </View>
                      )}
                      {category.icon === 'bulb' && (
                        <View style={styles.bulbContainer}>
                          <Ionicons name="bulb" size={35} color={category.iconColor} />
                          <View style={styles.bulbBase} />
                        </View>
                      )}
                      {category.icon === 'briefcase' && (
                        <Ionicons name="briefcase" size={40} color={category.iconColor} />
                      )}
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text style={[styles.categoryTitle, { fontSize: 18 * textScale }]}>
                        {category.title}
                      </Text>
                    </View>
                </View>
                  <Ionicons name="chevron-forward" size={24} color={theme.primary} />
                </TouchableOpacity>
              ))
            : null}

          {hasQuery && !isSearching
            ? searchResults.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  style={[styles.searchResultCard, { backgroundColor: theme.surface }]}
                  onPress={() => handleSearchResultPress(result)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${result.title}`}
                >
                  <Text style={[styles.searchResultTitle, { fontSize: 17 * textScale }]}>
                    {result.title}
                  </Text>
                  {result.excerpt ? (
                    <Text style={[styles.searchResultExcerpt, { fontSize: 13 * textScale }]} numberOfLines={2}>
                      {result.excerpt}
                    </Text>
                  ) : null}
                  <Ionicons name="chevron-forward" size={20} color={theme.primary} />
                </TouchableOpacity>
              ))
            : null}

          {hasQuery && !isSearching && searchResults.length === 0 ? (
            <View style={[styles.emptySearchState, { backgroundColor: theme.surface }]}> 
              <Text style={styles.emptySearchTitle}>
                {searchError ? 'Search is currently unavailable' : 'No results found'}
              </Text>
              <Text style={styles.emptySearchSubtext}>
                {searchError
                  ? 'Please try again in a moment.'
                  : 'Try different keywords to find support pages.'}
              </Text>
            </View>
          ) : null}

          {hasQuery && isSearching ? (
            <View style={styles.searchLoadingWrap}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={styles.searchLoadingText}>Searching sortedsupported.org.uk...</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.urgentHelpButton}
        onPress={() => {
          triggerLight();
          navigation.navigate('UrgentHelp');
        }}
        accessibilityRole="button"
        accessibilityLabel="Need urgent help"
      >
        <Text style={[styles.urgentHelpText, { fontSize: 17 * textScale }]}>Need urgent help?</Text>
      </TouchableOpacity>

      <Modal
        visible={settingsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSettingsVisible(false)}
        >
          <TouchableOpacity
            style={[styles.modalCard, { backgroundColor: theme.surface }]}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Settings</Text>
              <TouchableOpacity
                onPress={() => setSettingsVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close settings"
              >
                <Ionicons name="close" size={22} color={theme.subtext} />
              </TouchableOpacity>
            </View>
            <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />
            <View style={styles.settingRow}>
              <View style={styles.settingLabel}>
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={theme.primary} />
                <Text style={[styles.settingText, { color: theme.text }]}>Dark mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={() => {
                  triggerLight();
                  toggleTheme();
                }}
                trackColor={{ false: '#C0C0C0', true: '#8FA0D8' }}
                thumbColor={isDark ? '#5B6FA8' : '#FFFFFF'}
              />
            </View>

            <View style={[styles.settingRow, styles.textSizeRow]}>
              <View style={styles.settingLabel}>
                <Ionicons name="text" size={20} color={theme.primary} />
                <Text style={[styles.settingText, { color: theme.text }]}>Text size</Text>
              </View>
              <View style={styles.textAdjuster}>
                <TouchableOpacity
                  style={[styles.textStepButton, { borderColor: theme.border }]}
                  onPress={decreaseTextSize}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease text size"
                >
                  <Minus size={16} color={theme.primary} strokeWidth={2.6} />
                </TouchableOpacity>

                <Text style={[styles.textSizeValue, { color: theme.text }]}>{displayTextScale}</Text>

                <TouchableOpacity
                  style={[styles.textStepButton, { borderColor: theme.border }]}
                  onPress={increaseTextSize}
                  accessibilityRole="button"
                  accessibilityLabel="Increase text size"
                >
                  <Plus size={16} color={theme.primary} strokeWidth={2.6} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.versionWrap}>
              <Text style={[styles.versionText, { color: theme.subtext }]}>
                {buildNumber ? `Version: ${appVersion} (Build ${buildNumber})` : `Version: ${appVersion}`}
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    topBar: {
      marginTop: 14,
      marginHorizontal: 20,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    },
    topBarBrand: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 10,
    },
    logoWrap: {
      width: 44,
      height: 44,
      borderRadius: 10,
      marginRight: 10,
      backgroundColor: '#F3F6FD',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoImage: {
      width: 34,
      height: 34,
    },
    topBarTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.text,
    },
    topBarSubtitle: {
      fontSize: 13,
      marginTop: 1,
      color: theme.subtext,
    },
    topBarMenuButton: {
      width: 42,
      height: 42,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchWrap: {
      marginTop: 12,
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      borderRadius: 12,
      minHeight: 50,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    searchInput: {
      flex: 1,
      color: theme.text,
      fontSize: 15,
      paddingVertical: 10,
    },
    urgentHelpButton: {
      marginHorizontal: 20,
      marginBottom: 14,
      marginTop: 4,
      backgroundColor: '#F26A1B',
      borderRadius: 28,
      paddingVertical: 16,
      alignItems: 'center',
      shadowColor: '#F26A1B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 5,
    },
    urgentHelpText: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'flex-end',
    },
    modalCard: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 30,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
    },
    modalDivider: {
      height: 1,
      marginBottom: 16,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textSizeRow: {
      marginTop: 16,
    },
    settingLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    settingText: {
      fontSize: 16,
    },
    textAdjuster: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    textStepButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    textSizeValue: {
      minWidth: 30,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
    },
    versionWrap: {
      marginTop: 20,
      alignItems: 'center',
    },
    versionText: {
      fontSize: 12,
      textAlign: 'center',
    },
    categoriesContainer: {
      marginTop: 14,
      paddingHorizontal: 20,
    },
    categoryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    searchResultCard: {
      borderRadius: 12,
      marginBottom: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    searchResultTitle: {
      color: theme.text,
      fontWeight: '600',
      marginBottom: 4,
      paddingRight: 24,
    },
    searchResultExcerpt: {
      color: theme.subtext,
      lineHeight: 18,
      marginBottom: 8,
      paddingRight: 24,
    },
    emptySearchState: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingVertical: 22,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    emptySearchTitle: {
      fontSize: 17,
      color: theme.text,
      fontWeight: '600',
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySearchSubtext: {
      fontSize: 14,
      color: theme.subtext,
      textAlign: 'center',
    },
    searchLoadingWrap: {
      marginTop: 8,
      marginBottom: 10,
      alignItems: 'center',
    },
    searchLoadingText: {
      marginTop: 10,
      fontSize: 13,
      color: theme.subtext,
    },
    categoryContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    cardTextContainer: {
      flex: 1,
      paddingRight: 10,
    },
    iconContainer: {
      width: 60,
      height: 60,
      marginRight: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationIconContainer: {
      alignItems: 'center',
    },
    locationPin: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FF8C42',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: -5,
    },
    locationBase: {
      width: 50,
      height: 8,
      borderRadius: 25,
      backgroundColor: '#B3D9E8',
    },
    bulbContainer: {
      alignItems: 'center',
    },
    bulbBase: {
      width: 30,
      height: 8,
      backgroundColor: '#FFB84D',
      borderRadius: 4,
      marginTop: -8,
    },
    categoryTitle: {
      fontWeight: '600',
      color: '#2D3A57',
      flex: 1,
    },
  });

export default HomeScreen;
