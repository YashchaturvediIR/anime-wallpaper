import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { useWallpaperStore } from '@/hooks/wallpaper-store';

export default function SettingsScreen() {
  const { settings, updateSettings } = useWallpaperStore();

  const handleQualityChange = (quality: 'HD' | 'SD') => {
    updateSettings({ quality });
  };

  const handleAutoCacheToggle = (autoCache: boolean) => {
    updateSettings({ autoCache });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
          headerStyle: { backgroundColor: '#1a1a1a' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600' },
        }} 
      />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Image Quality</Text>
          <Text style={styles.sectionDescription}>
            Choose your preferred wallpaper quality
          </Text>
          
          <View style={styles.optionGroup}>
            <TouchableOpacity
              style={[
                styles.option,
                settings.quality === 'HD' && styles.selectedOption,
              ]}
              onPress={() => handleQualityChange('HD')}
              testID="quality-hd"
            >
              <Text
                style={[
                  styles.optionText,
                  settings.quality === 'HD' && styles.selectedOptionText,
                ]}
              >
                HD Quality
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  settings.quality === 'HD' && styles.selectedOptionDescription,
                ]}
              >
                Best quality, larger file size
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                settings.quality === 'SD' && styles.selectedOption,
              ]}
              onPress={() => handleQualityChange('SD')}
              testID="quality-sd"
            >
              <Text
                style={[
                  styles.optionText,
                  settings.quality === 'SD' && styles.selectedOptionText,
                ]}
              >
                SD Quality
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  settings.quality === 'SD' && styles.selectedOptionDescription,
                ]}
              >
                Faster loading, smaller file size
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.sectionTitle}>Auto Cache</Text>
              <Text style={styles.sectionDescription}>
                Automatically cache images for offline viewing
              </Text>
            </View>
            <Switch
              value={settings.autoCache}
              onValueChange={handleAutoCacheToggle}
              trackColor={{ false: '#3a3a3a', true: '#8b5cf6' }}
              thumbColor={settings.autoCache ? '#ffffff' : '#888888'}
              testID="auto-cache-switch"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Anime Wallpapers v1.0.0{'\n'}
            Powered by Waifu.pics API{'\n'}
            Made with ❤️ for anime fans
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 15,
  },
  optionGroup: {
    gap: 10,
  },
  option: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3a3a3a',
  },
  selectedOption: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  optionDescription: {
    fontSize: 12,
    color: '#888888',
  },
  selectedOptionDescription: {
    color: '#e0e0e0',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchContent: {
    flex: 1,
    marginRight: 15,
  },
  aboutText: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 20,
  },
});