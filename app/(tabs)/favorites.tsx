import WallpaperGrid from '@/components/WallpaperGrid';
import { useWallpaperStore } from '@/hooks/wallpaper-store';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {
  const { favorites } = useWallpaperStore();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Favorites',
          headerStyle: { backgroundColor: '#1a1a1a' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600' },
        }} 
      />

      <View style={styles.header}>
        <Text style={styles.title}>Your Favorite Wallpapers</Text>
        <Text style={styles.subtitle}>
          {favorites.length} wallpaper{favorites.length !== 1 ? 's' : ''} saved
        </Text>
      </View>

      {favorites.length > 0 ? (
        <WallpaperGrid wallpapers={favorites} />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Tap the heart icon on any wallpaper to add it to your favorites
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
  },
});