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
        {isLoading ? (
          <View style={styles.loadingCategories}>
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Discover Amazing Wallpapers</Text>
            <Text style={styles.subtitle}>
              Thousands of anime wallpapers at your fingertips
            </Text>
          </View>
        )}
      </View>

      <View style={{ marginVertical: 10 }}> {/* Add margin for spacing */}
        <CategoryFilter
         selectedCategory={selectedCategory}
         onCategoryChange={handleCategoryChange}
       />
      </View> {/* Closing the View component */}
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
    paddingVertical: 35,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ff69b4',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
    fontFamily: 'Dancing Script',
    fontStyle: 'italic',
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
  loadingCategories: {
    alignItems: 'center',
    marginVertical: 10,
  },
});
