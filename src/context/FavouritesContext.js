import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'favourites';
const FavouritesContext = createContext(null);

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadFavourites = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (isMounted && stored) {
          setFavourites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading favourites:', error);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    loadFavourites();

    return () => {
      isMounted = false;
    };
  }, []);

  const persist = useCallback(async (nextFavourites) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavourites));
    } catch (error) {
      console.error('Error saving favourites:', error);
    }
  }, []);

  const addFavourite = useCallback(
    async (item) => {
      let added = false;

      setFavourites((prev) => {
        if (prev.some((fav) => fav.url === item.url)) {
          return prev;
        }

        const next = [...prev, item];
        persist(next);
        added = true;
        return next;
      });

      return added;
    },
    [persist]
  );

  const removeFavouriteByUrl = useCallback(
    async (url) => {
      setFavourites((prev) => {
        const next = prev.filter((fav) => fav.url !== url);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeFavouriteById = useCallback(
    async (id) => {
      setFavourites((prev) => {
        const next = prev.filter((fav) => fav.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const updateFavouriteNote = useCallback(
    async (id, note) => {
      const cleanedNote = note.trim();

      setFavourites((prev) => {
        const next = prev.map((fav) => (fav.id === id ? { ...fav, note: cleanedNote } : fav));
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const reorderFavourites = useCallback(
    async (nextOrder) => {
      setFavourites(() => {
        persist(nextOrder);
        return nextOrder;
      });
    },
    [persist]
  );

  const isFavourited = useCallback(
    (url) => favourites.some((fav) => fav.url === url),
    [favourites]
  );

  const value = useMemo(
    () => ({
      favourites,
      isLoaded,
      addFavourite,
      removeFavouriteByUrl,
      removeFavouriteById,
      updateFavouriteNote,
      reorderFavourites,
      isFavourited,
    }),
    [
      favourites,
      isLoaded,
      addFavourite,
      removeFavouriteByUrl,
      removeFavouriteById,
      updateFavouriteNote,
      reorderFavourites,
      isFavourited,
    ]
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within FavouritesProvider');
  }

  return context;
};
