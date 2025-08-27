import CategoryFilter from '@/components/CategoryFilter';
import WallpaperGrid from '@/components/WallpaperGrid';
import { useWallpapers } from '@/hooks/wallpaper-store';
import { WallpaperCategory } from '@/types/wallpaper';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

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
            <Text style={styles.loadingText}>Loading App. Please wait...</Text>
          </View>
        ) : (
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
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
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 35,
      alignItems: 'center',
  justifyContent: 'center',
  height: 180,
  position: 'relative'
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
     marginTop: 8,  // only small gap from logo
  position: 'absolute',
  bottom: 30,   // stays inside header at bottom
  textAlign: 'center',
  width: '100%',
     
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
  logoContainer: {
     alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute', // take logo out of normal flow
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  },
  logo: {
    width: 360,
    height: 340,
    resizeMode: 'contain',
  },
});