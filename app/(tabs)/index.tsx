import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { WallpaperCategory } from '@/types/wallpaper';
import { useWallpapers } from '@/hooks/wallpaper-store';
import WallpaperGrid from '@/components/WallpaperGrid';
import CategoryFilter from '@/components/CategoryFilter';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<WallpaperCategory>('waifu');
  const { data: wallpapers, isLoading, refetch, isRefetching } = useWallpapers(selectedCategory);

  const handleCategoryChange = (category: WallpaperCategory) => {
    setSelectedCategory(category);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Anime Wallpapers',
          headerStyle: { backgroundColor: '#1a1a1a' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600' },
        }} 
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Discover Amazing Wallpapers</Text>
        <Text style={styles.subtitle}>Thousands of anime wallpapers at your fingertips</Text>
      </View>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {wallpapers && (
        <WallpaperGrid
          wallpapers={wallpapers}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}

      {isLoading && !wallpapers && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading amazing wallpapers...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 25, // Increased padding for more space
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888888',
  },
});