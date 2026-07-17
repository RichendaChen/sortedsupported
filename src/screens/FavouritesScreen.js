import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DragList from 'react-native-draglist';
import { NotebookPen, Pencil, Share2 } from 'lucide-react-native';
import SkeletonLoader from '../components/SkeletonLoader';
import { useTheme } from '../context/ThemeContext';
import SettingsModal from '../components/SettingsModal';
import { useFavourites } from '../context/FavouritesContext';
import { useHaptics } from '../hooks/useHaptics';

const FavouritesScreen = ({ navigation }) => {
  const { favourites, isLoaded, removeFavouriteById, updateFavouriteNote, reorderFavourites } =
    useFavourites();
  const { theme, textScale } = useTheme();
  const { triggerMedium } = useHaptics();
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const inputRefs = useRef({});

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

  const focusNoteInput = (id) => {
    setTimeout(() => {
      inputRefs.current[id]?.focus();
    }, 40);
  };

  const saveNote = async (itemId, note) => {
    await updateFavouriteNote(itemId, note);
    setEditingNoteId(null);
    setNoteDraft('');
  };

  const toggleNoteEditor = (item) => {
    triggerMedium();

    if (editingNoteId === item.id) {
      saveNote(item.id, noteDraft);
      return;
    }

    setEditingNoteId(item.id);
    setNoteDraft(item.note || '');
    focusNoteInput(item.id);
  };

  const shareFavourite = async (item) => {
    triggerMedium();

    const noteText = item.note?.trim() ? `\n\nNote: ${item.note.trim()}` : '';

    try {
      await Share.share({
        title: item.title,
        message: `${item.title}\n${item.url}${noteText}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share favourite');
    }
  };

  const onReordered = async (fromIndex, toIndex) => {
    const nextOrder = [...favourites];
    const [movedItem] = nextOrder.splice(fromIndex, 1);
    nextOrder.splice(toIndex, 0, movedItem);
    await reorderFavourites(nextOrder);
  };

  const styles = createStyles(theme);

  const renderItem = ({ item, onDragStart, onDragEnd, isActive }) => {
    const hasNote = Boolean(item.note?.trim());
    const isEditing = editingNoteId === item.id;

    return (
      <TouchableOpacity
        style={[styles.favouriteCard, isActive && styles.activeCard]}
        onPress={() => openFavourite(item)}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
        delayLongPress={220}
        disabled={isEditing}
        accessibilityRole="button"
        accessibilityLabel={`Open favourite ${item.title}`}
      >
        <TouchableOpacity
          onPress={() => removeFavourite(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`Remove favourite ${item.title}`}
          style={styles.heartButton}
        >
          <Ionicons name="heart" size={24} color={theme.danger} style={styles.heartIcon} />
        </TouchableOpacity>

        <View style={styles.favouriteText}>
          <Text style={[styles.favouriteTitle, { fontSize: 18 * textScale }]}>{item.title}</Text>

          {hasNote && !isEditing ? (
            <Text style={[styles.noteText, { fontSize: 15 * textScale }]}>{item.note.trim()}</Text>
          ) : null}

          {isEditing ? (
            <TextInput
              ref={(ref) => {
                inputRefs.current[item.id] = ref;
              }}
              style={[styles.noteInput, { fontSize: 12 * textScale }]}
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder="Add a note"
              placeholderTextColor={theme.subtext}
              multiline
              maxLength={280}
              onBlur={() => saveNote(item.id, noteDraft)}
              onSubmitEditing={() => saveNote(item.id, noteDraft)}
              blurOnSubmit
              returnKeyType="done"
              accessibilityLabel={`Note input for ${item.title}`}
            />
          ) : null}

          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => toggleNoteEditor(item)}
              accessibilityRole="button"
              accessibilityLabel={
                hasNote ? `Edit note for ${item.title}` : `Add note for ${item.title}`
              }
              style={styles.iconButton}
            >
              {hasNote ? (
                <Pencil size={20} color={theme.subtext} strokeWidth={2.2} />
              ) : (
                <NotebookPen size={20} color={theme.subtext} strokeWidth={2.2} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => shareFavourite(item)}
              accessibilityRole="button"
              accessibilityLabel={`Share favourite ${item.title}`}
              style={styles.iconButton}
            >
              <Share2 size={20} color={theme.subtext} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontSize: 28 * textScale }]}>Favourites</Text>
        <TouchableOpacity
          style={styles.topBarMenuButton}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={() => setSettingsVisible(true)}
        >
          <Ionicons name="menu" size={24} color={theme.primary} />
        </TouchableOpacity>
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
          <Text style={[styles.emptyText, { fontSize: 20 * textScale }]}>No favourites yet</Text>
          <Text style={[styles.emptySubtext, { fontSize: 14 * textScale }]}>Save pages you visit frequently for quick access</Text>
        </View>
      ) : (
        <DragList
          data={favourites}
          renderItem={renderItem}
          onReordered={onReordered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          accessibilityLabel="Favourites list"
        />
      )}

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
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
    listContent: {
      padding: 20,
    },
    favouriteCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
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
    activeCard: {
      opacity: 0.92,
      transform: [{ scale: 0.99 }],
    },
    heartButton: {
      marginRight: 12,
      paddingTop: 2,
      paddingHorizontal: 4,
      paddingBottom: 4,
    },
    heartIcon: {
      marginRight: 0,
    },
    favouriteText: {
      flex: 1,
    },
    favouriteTitle: {
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    noteText: {
      fontSize: 15,
      color: '#666666',
      lineHeight: 21,
      marginTop: 2,
    },
    noteInput: {
      color: theme.text,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginTop: 8,
      minHeight: 42,
      textAlignVertical: 'top',
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 8,
      gap: 14,
    },
    iconButton: {
      padding: 2,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyText: {
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
