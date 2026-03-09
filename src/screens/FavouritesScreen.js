import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavouritesScreen = ({ navigation }) => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    loadFavourites();
  }, []);

  const loadFavourites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favourites');
      if (stored) {
        setFavourites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favourites:', error);
    }
  };

  const removeFavourite = async (id) => {
    Alert.alert(
      'Remove Favourite',
      'Are you sure you want to remove this from favourites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updated = favourites.filter(item => item.id !== id);
            setFavourites(updated);
            try {
              await AsyncStorage.setItem('favourites', JSON.stringify(updated));
            } catch (error) {
              console.error('Error saving favourites:', error);
            }
          },
        },
      ]
    );
  };

  const openFavourite = (item) => {
    navigation.navigate('Home', {
      screen: 'WebView',
      params: { url: item.url, title: item.title }
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.favouriteCard}
      onPress={() => openFavourite(item)}
    >
      <View style={styles.favouriteContent}>
        <Ionicons name="heart" size={24} color="#FF6B9D" style={styles.heartIcon} />
        <View style={styles.favouriteText}>
          <Text style={styles.favouriteTitle}>{item.title}</Text>
          <Text style={styles.favouriteUrl} numberOfLines={1}>{item.url}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFavourite(item.id)}>
        <Ionicons name="trash-outline" size={22} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourites</Text>
      </View>
      
      {favourites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#CCC" />
          <Text style={styles.emptyText}>No favourites yet</Text>
          <Text style={styles.emptySubtext}>
            Save pages you visit frequently for quick access
          </Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5B6FA8',
  },
  listContent: {
    padding: 20,
  },
  favouriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
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
    color: '#333',
    marginBottom: 4,
  },
  favouriteUrl: {
    fontSize: 12,
    color: '#999',
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
    color: '#999',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default FavouritesScreen;
