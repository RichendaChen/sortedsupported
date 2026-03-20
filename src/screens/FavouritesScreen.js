import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SkeletonLoader from '../components/SkeletonLoader';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../context/FavouritesContext';
import { useHaptics } from '../hooks/useHaptics';

const FavouritesScreen = ({ navigation }) => {
  const { favourites, isLoaded, removeFavouriteById } = useFavourites();
  const { theme } = useTheme();
  const { triggerMedium } = useHaptics();

  const removeFavourite = (id) => {
    Alert.alert('Remove Favourite', 'Are you sure you want to remove this from favourites?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          triggerMedium();
          await removeFavouriteById(id);
        },
      },
    ]);
  };

  const openFavourite = (item) => {
    navigation.navigate('Home', {
      screen: 'WebView',
      params: { url: item.url, title: item.title },
    });
  };

  const styles = createStyles(theme);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favouriteCard}
      onPress={() => openFavourite(item)}
      accessibilityRole="button"
      accessibilityLabel={`Open favourite ${item.title}`}
    >
      <View style={styles.favouriteContent}>
        <Ionicons name="heart" size={24} color={theme.danger} style={styles.heartIcon} />
        <View style={styles.favouriteText}>
          <Text style={styles.favouriteTitle}>{item.title}</Text>
          <Text style={styles.favouriteUrl} numberOfLines={1}>
            {item.url}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => removeFavourite(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`Remove favourite ${item.title}`}
      >
        <Ionicons name="trash-outline" size={22} color={theme.subtext} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourites</Text>
      </View>

      {!isLoaded ? (
        <View style={styles.listContent}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={`fav-skeleton-${index}`} style={styles.loadingCard}>
              <SkeletonLoader width={30} height={30} borderRadius={15} />
              <View style={styles.loadingTextBlock}>
                <SkeletonLoader width="70%" height={18} />
                <SkeletonLoader width="95%" height={13} style={{ marginTop: 8 }} />
              </View>
            </View>
          ))}
        </View>
      ) : favourites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={theme.subtext} />
          <Text style={styles.emptyText}>No favourites yet</Text>
          <Text style={styles.emptySubtext}>Save pages you visit frequently for quick access</Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          accessibilityLabel="Favourites list"
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.surface,
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.primary,
    },
    listContent: {
      padding: 20,
    },
    favouriteCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surface,
      padding: 15,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    favouriteContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    heartIcon: {
      marginRight: 15,
    },
    favouriteText: {
      flex: 1,
    },
    favouriteTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    favouriteUrl: {
      fontSize: 12,
      color: theme.subtext,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.text,
      marginTop: 20,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.subtext,
      textAlign: 'center',
      marginTop: 10,
    },
    loadingCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 12,
      marginBottom: 12,
      padding: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },
    loadingTextBlock: {
      flex: 1,
      marginLeft: 15,
    },
  });

export default FavouritesScreen;
