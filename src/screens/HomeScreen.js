import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SkeletonLoader from '../components/SkeletonLoader';
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
    lat: 51.6214,
    lng: -3.9436,
  },
  {
    id: '2',
    title: 'Coping with Common Issues',
    url: 'https://www.sortedsupported.org.uk/coping-with-common-issues/',
    icon: 'bulb',
    backgroundColor: '#F5D5E0',
    iconColor: '#FFA500',
    lat: 51.5806,
    lng: -3.792,
  },
  {
    id: '3',
    title: 'Professionals',
    url: 'https://www.sortedsupported.org.uk/im-a-professional/',
    icon: 'briefcase',
    backgroundColor: '#D5DAED',
    iconColor: '#6B7AA1',
    lat: 51.6208,
    lng: -3.9432,
  },
  {
    id: '4',
    title: 'Easy Read',
    url: 'https://www.easyread.sortedsupported.org.uk/',
    icon: 'book',
    backgroundColor: '#FFF4C2',
    iconColor: '#FFB84D',
    lat: 51.6641,
    lng: -3.7993,
  },
];

const toRadians = (value) => (value * Math.PI) / 180;

const calculateDistanceKm = (fromLat, fromLng, toLat, toLng) => {
  const earthRadius = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedCategories, setSortedCategories] = useState(BASE_CATEGORIES);
  const [distanceMap, setDistanceMap] = useState({});
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isFindingNearest, setIsFindingNearest] = useState(false);
  const { theme, isDark } = useTheme();
  const { triggerLight, triggerWarning } = useHaptics();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearchLoading(false);
      return;
    }

    setIsSearchLoading(true);
    const timeout = setTimeout(() => {
      setIsSearchLoading(false);
    }, 180);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return sortedCategories;
    }

    return sortedCategories.filter((category) =>
      category.title.replace(/\n/g, ' ').toLowerCase().includes(normalizedQuery)
    );
  }, [searchQuery, sortedCategories]);

  const handleGetHelpNow = async () => {
    triggerWarning();

    Alert.alert('Call 999', 'This will open your phone dialer for emergency services.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Continue',
        onPress: async () => {
          const emergencyNumber = 'tel:999';

          try {
            const supported = await Linking.canOpenURL(emergencyNumber);
            if (supported) {
              await Linking.openURL(emergencyNumber);
              return;
            }
          } catch (error) {
            console.error('Error opening emergency dialer:', error);
          }

          const urgentUrl =
            'https://www.sortedsupported.org.uk/home-page/need-urgent-help/?utm_source=app&utm_medium=mobile&utm_campaign=app';
          navigation.navigate('WebView', { url: urgentUrl, title: 'Get Help Now' });
        },
      },
    ]);
  };

  const handleCategoryPress = (category) => {
    triggerLight();
    const separator = category.url.includes('?') ? '&' : '?';
    const urlWithUTM = `${category.url}${separator}utm_source=app&utm_medium=mobile&utm_campaign=app`;
    navigation.navigate('WebView', { url: urlWithUTM, title: category.title.replace('\n', ' ') });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const findNearestProfessional = async () => {
    setIsFindingNearest(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location permission denied', 'Enable location access to sort by nearest professional.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      const nextDistanceMap = {};

      const next = [...BASE_CATEGORIES].sort((a, b) => {
        const aDistance = calculateDistanceKm(userLat, userLng, a.lat, a.lng);
        const bDistance = calculateDistanceKm(userLat, userLng, b.lat, b.lng);

        nextDistanceMap[a.id] = aDistance;
        nextDistanceMap[b.id] = bDistance;

        return aDistance - bDistance;
      });

      setDistanceMap(nextDistanceMap);
      setSortedCategories(next);
    } catch (error) {
      console.error('Error finding nearest professional:', error);
      Alert.alert('Unable to get location', 'Please try again in a few moments.');
    } finally {
      setIsFindingNearest(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={logoImage} style={styles.logoImage} accessibilityLabel="Sorted Supported logo" />
        </View>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={handleGetHelpNow}
          accessibilityRole="button"
          accessibilityLabel="Get help now and open emergency dialer"
        >
          <Text style={styles.helpButtonText}>Get Help Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nearestButton}
          onPress={findNearestProfessional}
          accessibilityRole="button"
          accessibilityLabel="Find nearest professional based on your location"
        >
          <Ionicons name="locate" size={18} color={theme.primary} />
          <Text style={styles.nearestButtonText}>
            {isFindingNearest ? 'Finding nearest...' : 'Find nearest professional'}
          </Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for support services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.subtext}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search support services"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={20} color={theme.subtext} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.categoriesContainer}>
          {isSearchLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <View key={`search-skeleton-${index}`} style={styles.skeletonCard}>
                  <SkeletonLoader width={50} height={50} borderRadius={25} />
                  <View style={styles.skeletonTextBlock}>
                    <SkeletonLoader width="92%" height={18} />
                    <SkeletonLoader width="54%" height={14} style={{ marginTop: 10 }} />
                  </View>
                </View>
              ))
            : filteredCategories.map((category) => (
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
                      {category.icon === 'book' && (
                        <View style={styles.bookContainer}>
                          <Ionicons name="book" size={35} color={category.iconColor} />
                          <View style={styles.bookHand} />
                        </View>
                      )}
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      {distanceMap[category.id] ? (
                        <Text style={styles.distanceText}>{distanceMap[category.id].toFixed(1)} km away</Text>
                      ) : null}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={theme.primary} />
                </TouchableOpacity>
              ))}

          {!isSearchLoading && searchQuery.trim().length > 0 && filteredCategories.length === 0 && (
            <View style={styles.emptySearchState}>
              <Ionicons name="search-outline" size={48} color={theme.subtext} />
              <Text style={styles.emptySearchTitle}>No results found</Text>
              <Text style={styles.emptySearchSubtitle}>Try a different keyword.</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    header: {
      backgroundColor: theme.surface,
      paddingVertical: 20,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    logoImage: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
    },
    helpButton: {
      backgroundColor: theme.warning,
      marginHorizontal: 20,
      marginTop: 20,
      paddingVertical: 18,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    helpButtonText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.primary,
    },
    nearestButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
      marginTop: 12,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 8,
    },
    nearestButtonText: {
      fontSize: 15,
      color: theme.primary,
      fontWeight: '600',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      marginHorizontal: 20,
      marginTop: 20,
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
    },
    categoriesContainer: {
      marginTop: 20,
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
    bookContainer: {
      alignItems: 'center',
    },
    bookHand: {
      width: 25,
      height: 15,
      backgroundColor: '#F5D5A0',
      borderRadius: 8,
      marginTop: -10,
      marginLeft: 15,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#2D3A57',
      flex: 1,
    },
    distanceText: {
      marginTop: 8,
      fontSize: 13,
      color: '#334B77',
      fontWeight: '600',
    },
    emptySearchState: {
      marginTop: 16,
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 20,
    },
    emptySearchTitle: {
      marginTop: 8,
      fontSize: 18,
      color: theme.text,
      fontWeight: '600',
    },
    emptySearchSubtitle: {
      marginTop: 5,
      color: theme.subtext,
      fontSize: 14,
    },
    skeletonCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 12,
      marginBottom: 15,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    skeletonTextBlock: {
      flex: 1,
      marginLeft: 15,
    },
  });

export default HomeScreen;
