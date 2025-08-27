import { useWallpaperStore } from '@/hooks/wallpaper-store';
import { Wallpaper } from '@/types/wallpaper';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 30) / 2; // 2 columns with padding

export default function WallpaperGrid({ wallpapers, onRefresh, refreshing }: WallpaperGridProps) {
  const { isFavorite, toggleFavorite } = useWallpaperStore();

  const renderWallpaper = ({ item }: { item: Wallpaper }) => (
    <TouchableOpacity
      style={styles.wallpaperContainer}
      onPress={() => router.push({
        pathname: '/wallpaper-detail',
        params: { 
          url: item.url,
          id: item.id,
          category: item.category
        }
      })}
      testID={`wallpaper-${item.id}`}
    >
      <Image
        source={{ uri: item.url }}
        style={styles.wallpaperImage}
        contentFit="cover"
        transition={200}
        placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={(e) => {
          e.stopPropagation();
          toggleFavorite(item);
        }}
        testID={`favorite-${item.id}`}
      >
        <Heart
          size={20}
          color={isFavorite(item.id) ? '#ff4757' : '#ffffff'}
          fill={isFavorite(item.id) ? '#ff4757' : 'transparent'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (wallpapers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No wallpapers found</Text>
        <Text style={styles.emptySubtext}>Check your Internet connection</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={wallpapers}
      renderItem={renderWallpaper}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      onRefresh={onRefresh}
      refreshing={refreshing}
      showsVerticalScrollIndicator={false}
      testID="wallpaper-grid"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  wallpaperContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  wallpaperImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});