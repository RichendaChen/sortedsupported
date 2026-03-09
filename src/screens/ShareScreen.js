import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ShareScreen = () => {
  const shareApp = async () => {
    try {
      const result = await Share.share({
        message: 'Check out Sorted Supported - Support services for Swansea and Neath Port Talbot\n\nhttps://www.sortedsupported.org.uk/?utm_source=app&utm_medium=mobile&utm_campaign=app_share',
        title: 'Sorted Supported',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const shareOptions = [
    {
      id: 1,
      title: 'Share App',
      description: 'Tell others about Sorted Supported',
      icon: 'share-social',
      color: '#5B6FA8',
      action: shareApp,
    },
    {
      id: 2,
      title: 'Share via SMS',
      description: 'Send a text message',
      icon: 'chatbubble',
      color: '#4CAF50',
      action: shareApp,
    },
    {
      id: 3,
      title: 'Share via Email',
      description: 'Send an email',
      icon: 'mail',
      color: '#FF8C42',
      action: shareApp,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Share</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={50} color="#5B6FA8" />
          <Text style={styles.infoTitle}>Share Sorted Supported</Text>
          <Text style={styles.infoText}>
            Help others discover support services in Swansea and Neath Port Talbot
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {shareOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.shareOption}
              onPress={option.action}
            >
              <View style={[styles.iconCircle, { backgroundColor: option.color + '20' }]}>
                <Ionicons name={option.icon} size={28} color={option.color} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.websiteCard}>
          <Text style={styles.websiteLabel}>Website</Text>
          <Text style={styles.websiteUrl}>www.sortedsupported.org.uk</Text>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5B6FA8',
    marginTop: 15,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#999',
  },
  websiteCard: {
    backgroundColor: '#5B6FA8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  websiteLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  websiteUrl: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ShareScreen;
