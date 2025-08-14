import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WallpaperCategory } from '@/types/wallpaper';
import { WALLPAPER_CATEGORIES } from '@/services/wallpaper-api';

interface CategoryFilterProps {
  selectedCategory: WallpaperCategory;
  onCategoryChange: (category: WallpaperCategory) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      testID="category-filter"
    >
      {WALLPAPER_CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.value}
          style={[
            styles.categoryButton,
            selectedCategory === category.value && styles.selectedCategory,
          ]}
          onPress={() => onCategoryChange(category.value)}
          testID={`category-${category.value}`}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.value && styles.selectedCategoryText,
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#3a3a3a', // Add a background color for better contrast
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  selectedCategory: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  categoryText: {
    color: '#ff69b4', // Change text color to a brighter shade
    // backgroundColor: '#2a2a2a', // Remove background color
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});