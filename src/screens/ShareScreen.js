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
import { useTheme } from '../context/ThemeContext';
import SettingsModal from '../components/SettingsModal';
import { useHaptics } from '../hooks/useHaptics';

const SHARE_URL =
  'https://www.sortedsupported.org.uk/?utm_source=app&utm_medium=mobile&utm_campaign=app_share';

const SHARE_MESSAGE =
  'Check out SortedSupported - Support services for Swansea and Neath Port Talbot\n\n' + SHARE_URL;

const ShareScreen = () => {
  const { theme, textScale } = useTheme();
  const { triggerLight } = useHaptics();
  const [settingsVisible, setSettingsVisible] = React.useState(false);

  const shareApp = async () => {
    triggerLight();

    try {
      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({
            title: 'SortedSupported',
            text: SHARE_MESSAGE,
            url: SHARE_URL,
          });
          return;
        }

        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(SHARE_URL);
          Alert.alert('Link copied', 'Sharing is not supported here, so the link was copied instead.');
          return;
        }

        Alert.alert('Share unavailable', 'Copy this link: ' + SHARE_URL);
        return;
      }

      await Share.share({
        message: SHARE_MESSAGE,
        title: 'SortedSupported',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontSize: 28 * textScale }]}>Share</Text>
        <TouchableOpacity
          style={styles.topBarMenuButton}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={() => setSettingsVisible(true)}
        >
          <Ionicons name="menu" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={50} color={theme.primary} />
          <Text style={[styles.infoTitle, { fontSize: 22 * textScale }]}>Share SortedSupported</Text>
          <Text style={[styles.infoText, { fontSize: 14 * textScale }]}> 
            Help others discover support services in Swansea and Neath Port Talbot.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={shareApp}
          accessibilityRole="button"
          accessibilityLabel="Share SortedSupported"
        >
          <Ionicons name="share-social" size={24} color="#FFFFFF" />
          <Text style={[styles.shareButtonText, { fontSize: 18 * textScale }]}>Share SortedSupported</Text>
        </TouchableOpacity>

        <View style={styles.websiteCard}>
          <Text style={[styles.websiteLabel, { fontSize: 14 * textScale }]}>Website</Text>
          <Text style={[styles.websiteUrl, { fontSize: 18 * textScale }]}>www.sortedsupported.org.uk</Text>
        </View>
      </View>

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      fontWeight: 'bold',
      color: theme.primary,
    },
    topBarMenuButton: {
      width: 42,
      height: 42,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    infoCard: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 30,
      alignItems: 'center',
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    infoTitle: {
      fontWeight: 'bold',
      color: theme.primary,
      marginTop: 15,
      marginBottom: 10,
    },
    infoText: {
      color: theme.subtext,
      textAlign: 'center',
      lineHeight: 20,
    },
    shareButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
    },
    shareButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    websiteCard: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 20,
      alignItems: 'center',
    },
    websiteLabel: {
      color: theme.subtext,
      marginBottom: 5,
    },
    websiteUrl: {
      fontWeight: 'bold',
      color: theme.primary,
    },
  });

export default ShareScreen;
