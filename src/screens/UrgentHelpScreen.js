import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const UrgentHelpScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const callNumber = (number) => {
    Linking.openURL(`tel:${number}`).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.emergencyBanner}>
          <Ionicons name="warning" size={28} color="#FFFFFF" style={styles.warningIcon} />
          <Text style={styles.emergencyTitle}>Seriously injured or taken an overdose?</Text>
          <Text style={styles.emergencyDesc}>
            Call 999 immediately or go to A&E.
          </Text>
          <TouchableOpacity
            style={styles.emergencyCallButton}
            onPress={() => callNumber('999')}
            accessibilityRole="button"
            accessibilityLabel="Call 999"
          >
            <Ionicons name="call" size={20} color="#CC0000" />
            <Text style={styles.emergencyCallText}>Call 999</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.introText}>
          Talk to someone straight away, especially if you're feeling suicidal, in crisis, or feel like you can't cope. If possible, make sure someone is with you.
        </Text>

        <Text style={styles.sectionTitle}>Local Services</Text>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>111 option 2</Text>
          <Text style={styles.serviceDesc}>
            Mental health support is available over the phone from NHS professionals. Running 24 hours a day, seven days a week, offering triage and support.
          </Text>
          <Text style={styles.serviceHours}>
            <Ionicons name="time-outline" size={13} color={theme.subtext} /> Available 24/7
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => callNumber('111')}
            accessibilityRole="button"
            accessibilityLabel="Call 111 and choose option 2"
          >
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={styles.callButtonText}>Call 111 (choose option 2)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>Mental Health Sanctuary – Swansea Bay</Text>
          <Text style={styles.serviceDesc}>
            Out-of-hours service providing practical and therapeutic, holistic support for people at risk of mental health crisis in Swansea and Neath Port Talbot.
          </Text>
          <Text style={styles.serviceHours}>
            <Ionicons name="time-outline" size={13} color={theme.subtext} /> 6pm – 3am, 7 days a week, 365 days a year
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => callNumber('01792399676')}
            accessibilityRole="button"
            accessibilityLabel="Call 01792 399676"
          >
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={styles.callButtonText}>Call 01792 399676</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>National Helplines</Text>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>Samaritans</Text>
          <Text style={styles.serviceDesc}>
            Available 24/7 if you're feeling overwhelmed or struggling to cope. Online chat also available.
          </Text>
          <Text style={styles.serviceHours}>
            <Ionicons name="time-outline" size={13} color={theme.subtext} /> Available 24/7
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => callNumber('116123')}
            accessibilityRole="button"
            accessibilityLabel="Call Samaritans on 116 123"
          >
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={styles.callButtonText}>Call 116 123 (free)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>C.A.L.L Mental Health Helpline</Text>
          <Text style={styles.serviceDesc}>
            24/7 confidential listening and support service for Wales. Freephone or text support available.
          </Text>
          <Text style={styles.serviceHours}>
            <Ionicons name="time-outline" size={13} color={theme.subtext} /> Available 24/7
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => callNumber('0800132737')}
            accessibilityRole="button"
            accessibilityLabel="Call C.A.L.L helpline on 0800 132 737"
          >
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={styles.callButtonText}>Call 0800 132 737 (free)</Text>
          </TouchableOpacity>
          <Text style={styles.textAlt}>Or text 'help' to 81066</Text>
        </View>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>SANEline</Text>
          <Text style={styles.serviceDesc}>
            Emotional support and information for people affected by mental health problems.
          </Text>
          <Text style={styles.serviceHours}>
            <Ionicons name="time-outline" size={13} color={theme.subtext} /> 4pm – 10pm, 365 days a year
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => callNumber('03003047000')}
            accessibilityRole="button"
            accessibilityLabel="Call SANEline on 0300 304 7000"
          >
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={styles.callButtonText}>Call 0300 304 7000</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.serviceCard, styles.lastCard]}>
          <Text style={styles.serviceName}>Calm Zone</Text>
          <Text style={styles.serviceDesc}>
            Support for those struggling with life. Helpline and webchat available.
          </Text>
          <Text style={styles.serviceHours}>
            <Ionicons name="time-outline" size={13} color={theme.subtext} /> 5pm – midnight, 365 days a year
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => callNumber('0800585858')}
            accessibilityRole="button"
            accessibilityLabel="Call Calm Zone on 0800 58 58 58"
          >
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={styles.callButtonText}>Call 0800 58 58 58 (free)</Text>
          </TouchableOpacity>
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
      padding: 16,
      paddingBottom: 32,
    },
    emergencyBanner: {
      backgroundColor: '#CC0000',
      borderRadius: 14,
      padding: 18,
      marginBottom: 16,
      alignItems: 'center',
    },
    warningIcon: {
      marginBottom: 8,
    },
    emergencyTitle: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 6,
    },
    emergencyDesc: {
      color: '#FFDDDD',
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 14,
    },
    emergencyCallButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 24,
      gap: 8,
    },
    emergencyCallText: {
      color: '#CC0000',
      fontWeight: '700',
      fontSize: 16,
    },
    introText: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 21,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 10,
      marginTop: 4,
    },
    serviceCard: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    lastCard: {
      marginBottom: 0,
    },
    serviceName: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 6,
    },
    serviceDesc: {
      fontSize: 14,
      color: theme.subtext,
      lineHeight: 20,
      marginBottom: 8,
    },
    serviceHours: {
      fontSize: 13,
      color: theme.subtext,
      marginBottom: 12,
    },
    callButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#5B6FA8',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 14,
      gap: 8,
      alignSelf: 'flex-start',
    },
    callButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
    textAlt: {
      marginTop: 8,
      fontSize: 13,
      color: theme.subtext,
    },
  });

export default UrgentHelpScreen;
