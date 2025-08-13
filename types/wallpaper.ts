export interface Wallpaper {
  url: string;
  id: string;
  category: WallpaperCategory;
  isFavorite?: boolean;
}

export type WallpaperCategory = 'waifu' | 'neko' | 'shinobu' | 'megumin' | 'bully' | 'cuddle' | 'cry' | 'hug' | 'awoo' | 'kiss' | 'lick' | 'pat' | 'smug' | 'bonk' | 'yeet' | 'blush' | 'smile' | 'wave' | 'highfive' | 'handhold' | 'nom' | 'bite' | 'glomp' | 'slap' | 'kill' | 'kick' | 'happy' | 'wink' | 'poke' | 'dance' | 'cringe';

export interface WallpaperSettings {
  quality: 'HD' | 'SD';
  autoCache: boolean;
}