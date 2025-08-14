import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform, Alert } from 'react-native';

export class DownloadService {
  /**
   * Downloads a wallpaper with proper error handling and permissions
   */
  static async downloadWallpaper(
    url: string, 
    filename: string,
    onProgress?: (progress: number) => void
  ): Promise<{ success: boolean; uri?: string; error?: string }> {
    try {
      // Step 1: Validate URL
      if (!url || !url.startsWith('http')) {
        return { success: false, error: 'Invalid URL provided' };
      }

      // Step 2: Check and request permissions
      const permissionResult = await this.checkAndRequestPermissions();
      if (!permissionResult.granted) {
        return { 
          success: false, 
          error: 'Media library permissions denied' 
        };
      }

      // Step 3: Create safe filename
      const safeFilename = this.sanitizeFilename(filename);
      
      // Step 4: Create download directory
      const downloadDir = FileSystem.cacheDirectory + 'wallpapers/';
      await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });

      // Step 5: Download file with progress tracking
      const fileUri = downloadDir + safeFilename;
      
      const downloadResult = await FileSystem.downloadAsync(url, fileUri, {
        headers: {
          'Accept': 'image/*',
        },
      });

      if (downloadResult.status !== 200) {
        throw new Error(`HTTP ${downloadResult.status}: ${downloadResult.headers['content-type'] || 'Unknown error'}`);
      }

      console.log('Download URI:', downloadResult.uri); // Debug log
      const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
      if (!fileInfo.exists || fileInfo.size === 0) {
        throw new Error('Downloaded file is empty or corrupted');
      }

      // Step 7: Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      
      // Step 8: Optional - Add to Downloads album
      if (Platform.OS === 'android') {
        await this.addToDownloadsAlbum(asset);
      }

      // Step 9: Clean up temporary file
      await FileSystem.deleteAsync(downloadResult.uri, { idempotent: true });

      return { success: true, uri: asset.uri };

    } catch (error) {
      console.error('Download error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown download error' 
      };
    }
  }

  /**
   * Checks and requests media library permissions
   */
  private static async checkAndRequestPermissions(): Promise<{ granted: boolean }> {
    try {
      // Check current permissions
      const { status: existingStatus } = await MediaLibrary.getPermissionsAsync();
      
      if (existingStatus === 'granted') {
        return { granted: true };
      }

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        // Show permission alert
        Alert.alert(
          'Permission Required',
          'This app needs permission to save wallpapers to your gallery.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => MediaLibrary.requestPermissionsAsync() }
          ]
        );
      }

      return { granted: status === 'granted' };
    } catch (error) {
      console.error('Permission error:', error);
      return { granted: false };
    }
  }

  /**
   * Sanitizes filename to prevent issues
   */
  private static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 100);
  }

  /**
   * Adds asset to Downloads album on Android
   */
  private static async addToDownloadsAlbum(asset: MediaLibrary.Asset): Promise<void> {
    try {
      const downloadsAlbum = await MediaLibrary.getAlbumAsync('Download');
      if (downloadsAlbum) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], downloadsAlbum, false);
      }
    } catch (error) {
      console.log('Could not add to Downloads album:', error);
      // Non-critical error, continue
    }
  }

  /**
   * Gets available storage space
   */
  static async getAvailableStorage(): Promise<number> {
    try {
      const info = await FileSystem.getFreeDiskStorageAsync();
      return info;
    } catch {
      return 0;
    }
  }
}
