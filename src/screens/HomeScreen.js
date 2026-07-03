import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

  const handleCategoryPress = (category) => {
    triggerLight();
    const separator = category.url.includes('?') ? '&' : '?';
    const urlWithUTM = `${category.url}${separator}utm_source=app&utm_medium=mobile&utm_campaign=app`;
    navigation.navigate('WebView', { url: urlWithUTM, title: category.title.replace('\n', ' ') });
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

        <View style={styles.categoriesContainer}>
          {BASE_CATEGORIES.map((category) => (
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
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.primary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.urgentHelpButton}
        onPress={() => { triggerLight(); navigation.navigate('UrgentHelp'); }}
        accessibilityRole="button"
        accessibilityLabel="Need urgent help"
      >
        <Text style={styles.urgentHelpText}>Need urgent help?</Text>
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
                onValueChange={() => { triggerLight(); toggleTheme(); }}
                trackColor={{ false: '#C0C0C0', true: '#8FA0D8' }}
                thumbColor={isDark ? '#5B6FA8' : '#FFFFFF'}
              />
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
      fontSize: 17,
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
      paddingBottom: 36,
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
    settingLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    settingText: {
      fontSize: 16,
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
      fontSize: 18,
      fontWeight: '600',
      color: '#2D3A57',
      flex: 1,
    },
  });

export default HomeScreen;
