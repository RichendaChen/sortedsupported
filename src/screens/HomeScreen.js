import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 1,
      title: "What's in Swansea,\nNeath Port Talbot for me",
      url: 'https://www.sortedsupported.org.uk/',
      icon: 'location',
      backgroundColor: '#C8E6F5',
      iconColor: '#FF8C42',
    },
    {
      id: 2,
      title: 'Coping with Common Issues',
      url: 'https://www.sortedsupported.org.uk/coping-with-common-issues/',
      icon: 'bulb',
      backgroundColor: '#F5D5E0',
      iconColor: '#FFA500',
    },
    {
      id: 3,
      title: 'Professionals',
      url: 'https://www.sortedsupported.org.uk/professionals/',
      icon: 'briefcase',
      backgroundColor: '#D5DAED',
      iconColor: '#6B7AA1',
    },
    {
      id: 4,
      title: 'Easy Read',
      url: 'https://www.easyread.sortedsupported.org.uk/',
      icon: 'book',
      backgroundColor: '#FFF4C2',
      iconColor: '#FFB84D',
    },
  ];

  const handleGetHelpNow = () => {
    const urgentUrl = 'https://www.sortedsupported.org.uk/?utm_source=app&utm_medium=mobile&utm_campaign=app';
    navigation.navigate('WebView', { url: urgentUrl, title: 'Get Help Now' });
  };

  const handleCategoryPress = (category) => {
    const urlWithUTM = `${category.url}?utm_source=app&utm_medium=mobile&utm_campaign=app`;
    navigation.navigate('WebView', { url: urlWithUTM, title: category.title.replace('\n', ' ') });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoShapes}>
              <View style={[styles.shape, { backgroundColor: '#FFB84D', top: 10, left: 0 }]} />
              <View style={[styles.shape, { backgroundColor: '#F5B8D4', top: 0, left: 20 }]} />
              <View style={[styles.shape, { backgroundColor: '#A4B5D9', top: 20, left: 15 }]} />
              <View style={[styles.shape, { backgroundColor: '#FFE66D', top: 10, left: 35 }]} />
              <View style={[styles.shape, { backgroundColor: '#B8E0F0', top: 30, left: 5 }]} />
            </View>
            <View style={styles.logoText}>
              <Text style={styles.logoTitle}>Sorted</Text>
              <Text style={styles.logoTitle}>Supported</Text>
              <Text style={styles.logoSubtitle}>.org.uk</Text>
            </View>
          </View>
        </View>

        {/* Get Help Now Button */}
        <TouchableOpacity style={styles.helpButton} onPress={handleGetHelpNow}>
          <Text style={styles.helpButtonText}>Get Help Now</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for support services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* Category Cards */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
              onPress={() => handleCategoryPress(category)}
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
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#5B6FA8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoShapes: {
    width: 60,
    height: 60,
    position: 'relative',
    marginRight: 15,
  },
  shape: {
    width: 20,
    height: 20,
    borderRadius: 8,
    position: 'absolute',
  },
  logoText: {
    alignItems: 'flex-start',
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5B6FA8',
    lineHeight: 32,
  },
  logoSubtitle: {
    fontSize: 16,
    color: '#FF8C42',
    fontWeight: '600',
  },
  helpButton: {
    backgroundColor: '#FFD93D',
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
    color: '#5B6FA8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
    color: '#5B6FA8',
    flex: 1,
  },
});

export default HomeScreen;
