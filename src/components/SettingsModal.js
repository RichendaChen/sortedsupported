import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useHaptics } from '../hooks/useHaptics';

const SettingsModal = ({ visible, onClose }) => {
  const { theme, isDark, toggleTheme, textScale, increaseTextScale, decreaseTextScale } = useTheme();
  const { triggerLight } = useHaptics();

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
  const styles = createStyles(theme);

  const handleToggleTheme = () => {
    triggerLight();
    toggleTheme();
  };

  const handleDecreaseText = () => {
    triggerLight();
    decreaseTextScale();
  };

  const handleIncreaseText = () => {
    triggerLight();
    increaseTextScale();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={[styles.modalCard, { backgroundColor: theme.surface }]}
          activeOpacity={1}
          onPress={() => {}}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text, fontSize: 20 * textScale }]}>Settings</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Close settings">
              <Ionicons name="close" size={22} color={theme.subtext} />
            </TouchableOpacity>
          </View>
          <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text, fontSize: 16 * textScale }]}>Dark mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleToggleTheme}
              trackColor={{ false: '#C0C0C0', true: '#8FA0D8' }}
              thumbColor={isDark ? '#5B6FA8' : '#FFFFFF'}
            />
          </View>

          <View style={[styles.settingRow, styles.textSizeRow]}>
            <View style={styles.settingLabel}>
              <Ionicons name="text" size={20} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text, fontSize: 16 * textScale }]}>Text size</Text>
            </View>
            <View style={styles.textAdjuster}>
              <TouchableOpacity
                style={[styles.textStepButton, { borderColor: theme.border }]}
                onPress={handleDecreaseText}
                accessibilityRole="button"
                accessibilityLabel="Decrease text size"
              >
                <Minus size={16} color={theme.primary} strokeWidth={2.6} />
              </TouchableOpacity>

              <Text style={[styles.textSizeValue, { color: theme.text, fontSize: 16 * textScale }]}>
                {displayTextScale}
              </Text>

              <TouchableOpacity
                style={[styles.textStepButton, { borderColor: theme.border }]}
                onPress={handleIncreaseText}
                accessibilityRole="button"
                accessibilityLabel="Increase text size"
              >
                <Plus size={16} color={theme.primary} strokeWidth={2.6} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.versionWrap}>
            <Text style={[styles.versionText, { color: theme.subtext, fontSize: 12 * textScale }]}>
              {buildNumber ? `Version: ${appVersion} (Build ${buildNumber})` : `Version: ${appVersion}`}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
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
      lineHeight: 22,
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
      fontWeight: '600',
    },
    versionWrap: {
      marginTop: 20,
      alignItems: 'center',
    },
    versionText: {
      textAlign: 'center',
    },
  });

export default SettingsModal;
