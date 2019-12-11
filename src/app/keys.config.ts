export const keysConfig = {
  SETTINGS_KEY: 'config',

  FONT_SIZE_KEY: 'font-size',
  FONT_SIZE_DEFAULT: 1, // To set font-size: 10px => 62.5%
  FONT_SIZE_STEP: 0.05,

  TOC_SIZE: 10,

  RETURN_URL_KEY: 'return-url',

  // Themes
  DEFAULT_THEME: 'indigo',
  SELECTED_THEME: 'theme',
  SELECTED_DARK_MODE: 'dark-mode',
  THEMES: ['indigo', 'purple'],

  // Authentication
  CURRENT_USER_KEY: 'user',

  SIDENAV_OPEN: 'sidenav-open',
  SIDENAV_MAX: 'sidenav-maximized',
};

export const dbKeys = {
  STATS_DOC: '---STATS---',

  CTags: 'tags',

  CGenres: 'genres',

  CUsers: 'users',

  CNovels: 'novels',
  CFavs: 'favourites',
  CLikes: 'likes',
  CNovelsChapters: 'chapters',
  CNovelsReviews: 'reviews',

  CStats: 'stats',
  CStatsReviews: 'reviews',
  CStatsChapters: 'chapters',

  CLibrary: 'libraries',
  CLibraryNovels: 'novels',

  CHistory: 'histories',
  CHistoryNovels: 'novels',
};

export const storageKeys = {
  BASIC_URL: 'https://firebasestorage.googleapis.com/v0/b/testing-192515.appspot.com/o/',
  DEFAULT_NAME: 'default',

  NovelsPath: 'novels',
  DefaultNovelsCoverFull: 'novels%2Fdefault%2Ffull.jpg?alt=media&token=73ce7344-1f28-4272-9d9b-a78df292eb9a',
  DefaultNovelsCoverThumb: 'novels%2Fdefault%2Fthumb.jpg?alt=media&token=e2465d3a-4ad8-4abb-afec-669f769859ce',
  NovelsCoverOriginal: 'orig',
  NovelsCoverThumb: 'thumb.jpg',
  NovelsCoverFull: 'full.jpg',

  GEN_URL: (base: string, ...data: string[]) => {
    return base + data.join('%2F');
  },

  // COMMON ERROR CODES:
  E404: 'storage/object-not-found',
};
