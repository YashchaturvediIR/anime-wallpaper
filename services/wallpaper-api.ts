import { WallpaperCategory, Wallpaper } from '@/types/wallpaper';

const BASE_URL = 'https://api.waifu.pics/sfw';

export class WallpaperAPI {
  static async getRandomWallpaper(category: WallpaperCategory): Promise<Wallpaper> {
    try {
      const response = await fetch(`${BASE_URL}/${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch wallpaper: ${response.status}`);
      }
      const data = await response.json();
      
      return {
        url: data.url,
        id: this.generateId(data.url),
        category,
      };
    } catch (error) {
      console.error('Error fetching wallpaper:', error);
      throw error;
    }
  }

  static async getMultipleWallpapers(category: WallpaperCategory, count: number = 20): Promise<Wallpaper[]> {
    const promises = Array.from({ length: count }, () => this.getRandomWallpaper(category));
    
    try {
      const results = await Promise.allSettled(promises);
      return results
        .filter((result): result is PromiseFulfilledResult<Wallpaper> => result.status === 'fulfilled')
        .map(result => result.value);
    } catch (error) {
      console.error('Error fetching multiple wallpapers:', error);
      throw error;
    }
  }

  private static generateId(url: string): string {
    return url.split('/').pop()?.split('.')[0] || Math.random().toString(36).substr(2, 9);
  }
}

export const WALLPAPER_CATEGORIES: { label: string; value: WallpaperCategory }[] = [
  { label: 'Waifu', value: 'waifu' },
  { label: 'Neko', value: 'neko' },
  { label: 'Shinobu', value: 'shinobu' },
  { label: 'Megumin', value: 'megumin' },
  { label: 'Hug', value: 'hug' },
  { label: 'Pat', value: 'pat' },
  { label: 'Smile', value: 'smile' },
  { label: 'Blush', value: 'blush' },
];