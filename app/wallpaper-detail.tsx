import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Heart, Download, Share, Smartphone } from 'lucide-react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import { useWallpaperStore } from '@/hooks/wallpaper-store';
import { Wallpaper } from '@/types/wallpaper';

export default function WallpaperDetailScreen() {
  const params = useLocalSearchParams();
  const { isFavorite, toggleFavorite } = useWallpaperStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const wallpaper: Wallpaper = {
    url: params.url as string,
    id: params.id as string,
    category: params.category as any,
  };

  const handleBack = () => {
    router.back();
  };

  const handleFavorite = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleFavorite(wallpaper);
  };

  const showToast = (message: string, isError = false) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else if (Platform.OS === 'ios') {
      // For iOS, we'll use haptics as a fallback since ToastAndroid is Android-only
      if (!isError) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Show downloading toast
      showToast('Downloading wallpaper...');

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        showToast('Permission denied', true);
        Alert.alert('Permission Required', 'Please grant permission to save images to your gallery.');
        return;
      }

      // Create filename with timestamp
      const timestamp = new Date().getTime();
      const filename = `anime_wallpaper_${wallpaper.id}_${timestamp}.jpg`;
      
      // Use document directory for all platforms, MediaLibrary will handle Downloads folder
      const downloadPath = FileSystem.documentDirectory + filename;

      // Download the image
      const downloadResult = await FileSystem.downloadAsync(wallpaper.url, downloadPath);

      if (downloadResult.status === 200) {
        // Save to media library (Downloads folder)
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
        
        // For Android, ensure it's in Downloads album
        if (Platform.OS === 'android') {
          try {
            const downloadsAlbum = await MediaLibrary.getAlbumAsync('Download');
            if (downloadsAlbum) {
              await MediaLibrary.addAssetsToAlbumAsync([asset], downloadsAlbum, false);
            }
          } catch (albumError) {
            console.log('Could not add to Downloads album:', albumError);
          }
        }

        // Provide haptic feedback
        if (Platform.OS !== 'web') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Show success toast
        showToast('Wallpaper saved to Your Gallery!');
        
        // Also show alert for confirmation
        Alert.alert('Success', 'Wallpaper saved to your Downloads folder!');
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      showToast('Download failed', true);
      
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      
      Alert.alert('Error', 'Failed to download wallpaper. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        // Download temporarily for sharing
        const fileUri = FileSystem.cacheDirectory + `temp_wallpaper_${wallpaper.id}.jpg`;
        const downloadResult = await FileSystem.downloadAsync(wallpaper.url, fileUri);
        
        if (downloadResult.status === 200) {
          await Sharing.shareAsync(downloadResult.uri);
        }
      } else {
        // Fallback to sharing URL
        Alert.alert('Share', wallpaper.url);
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share wallpaper.');
    }
  };

  const handleSetWallpaper = () => {
    Alert.alert(
      'Set as Wallpaper',
      'To set this as your wallpaper:\n\n1. Download the image\n2. Go to your device Settings\n3. Navigate to Wallpaper/Display settings\n4. Select the downloaded image from your Downloads folder',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download First', onPress: handleDownload },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: wallpaper.url }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        
        {/* Header overlay */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            testID="back-button"
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavorite}
            testID="favorite-button"
          >
            <Heart
              size={24}
              color={isFavorite(wallpaper.id) ? '#ff4757' : '#ffffff'}
              fill={isFavorite(wallpaper.id) ? '#ff4757' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.categoryText}>{wallpaper.category.toUpperCase()}</Text>
          <Text style={styles.idText}>ID: {wallpaper.id}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton, isDownloading && styles.disabledButton]}
            onPress={handleDownload}
            disabled={isDownloading}
            testID="download-button"
          >
            <Download size={20} color="#ffffff" />
            <Text style={styles.buttonText}>
              {isDownloading ? 'Downloading...' : 'Download'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
            testID="share-button"
          >
            <Share size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, styles.setWallpaperButton]}
          onPress={handleSetWallpaper}
          testID="set-wallpaper-button"
        >
          <Smartphone size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Set as Wallpaper</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 12,
  },
  favoriteButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 12,
  },
  actionsContainer: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  idText: {
    fontSize: 12,
    color: '#888888',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
  },
  setWallpaperButton: {
    backgroundColor: '#ff4757',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#666666',
    opacity: 0.7,
  },
});
