import { WallpaperAPI } from '@/services/wallpaper-api';
import { Wallpaper, WallpaperCategory, WallpaperSettings } from '@/types/wallpaper';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

const FAVORITES_KEY = 'wallpaper_favorites';
const SETTINGS_KEY = 'wallpaper_settings';

export const [WallpaperProvider, useWallpaperStore] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [settings, setSettings] = useState<WallpaperSettings>({
    quality: 'SD',
    autoCache: true,
  });

  // Load favorites from storage
  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  // Load settings from storage
  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : { quality: 'SD', autoCache: true };
    },
  });

  // Save favorites mutation
  const saveFavoritesMutation = useMutation({
    mutationFn: async (newFavorites: Wallpaper[]) => {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['favorites'], data);
    },
  });

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: WallpaperSettings) => {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      return newSettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
    },
  });

  useEffect(() => {
    if (favoritesQuery.data) {
      setFavorites(favoritesQuery.data);
    }
  }, [favoritesQuery.data]);

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data);
    }
  }, [settingsQuery.data]);

  const { mutate: mutateFavorites } = saveFavoritesMutation;
  const toggleFavorite = useCallback((wallpaper: Wallpaper) => {
    const isFavorite = favorites.some(fav => fav.id === wallpaper.id);
    let newFavorites: Wallpaper[];
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== wallpaper.id);
    } else {
      newFavorites = [...favorites, { ...wallpaper, isFavorite: true }];
    }
    
    setFavorites(newFavorites);
    mutateFavorites(newFavorites);
  }, [favorites, mutateFavorites]);

  const isFavorite = useCallback((wallpaperId: string) => {
    return favorites.some(fav => fav.id === wallpaperId);
  }, [favorites]);

  const { mutate: mutateSettings } = saveSettingsMutation;
  const updateSettings = useCallback((newSettings: Partial<WallpaperSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    mutateSettings(updatedSettings);
  }, [settings, mutateSettings]);

  return useMemo(() => ({
    favorites,
    settings,
    toggleFavorite,
    isFavorite,
    updateSettings,
    isLoading: favoritesQuery.isLoading || settingsQuery.isLoading,
  }), [favorites, settings, toggleFavorite, isFavorite, updateSettings, favoritesQuery.isLoading, settingsQuery.isLoading]);
});

export const useWallpapers = (category: WallpaperCategory) => {
  return useQuery({
    queryKey: ['wallpapers', category],
    queryFn: () => WallpaperAPI.getMultipleWallpapers(category, 20),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRandomWallpaper = (category: WallpaperCategory) => {
  return useQuery({
    queryKey: ['random-wallpaper', category],
    queryFn: () => WallpaperAPI.getRandomWallpaper(category),
    enabled: false, // Only fetch when explicitly called
  });
};