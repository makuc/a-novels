export const keysConfig = {
  SETTINGS_KEY: 'config',

  FONT_SIZE_KEY: 'font-size',
  FONT_SIZE_DEFAULT: 1, // To set font-size: 10px => 62.5%
  FONT_SIZE_STEP: 0.05,

  RETURN_URL_KEY: 'return-url',

  // Themes
  DEFAULT_THEME: 'indigo',
  SELECTED_THEME: 'theme',
  SELECTED_THEME_DARK_MODE: 'dark-mode',
  THEMES: ['indigo', 'purple'],

  // API
  // API_URL: 'http://localhost:4000',

  // Authentication
  CURRENT_USER_KEY: 'user',

  SIDENAV_OPEN: 'sidenav-open',
  SIDENAV_MAXIMIZED: 'sidenav-maximized',
};

export const dbKeys = {
  STATS_DOC: '---STATS---',

  COLLECTION_TAGS: 'tags',

  COLLECTION_GENRES: 'genres',

  COLLECTION_USERS: 'users',

  COLLECTION_NOVELS: 'novels',
  COLLECTION_NOVELS_CHAPTERS: 'chapters',
  COLLECTION_NOVELS_REVIEWS: 'reviews',
};

export const storageKeys = {
  BASIC_URL: 'https://firebasestorage.googleapis.com/v0/b/testing-192515.appspot.com/o/',

  NOVELS_COVER_PATH: 'novels',
  NOVELS_COVER_FULL: 'cover-full.jpg?alt=media',
  NOVELS_COVER_THUMBNAIL: 'cover-full.jpg?alt=media',
  NOVELS_COVER_ORIGINAL: 'cover-full.jpg',

  GEN_URL: (base: string, ...data: string[]) => {
    return base + data.join('%2F');
  },

  // COMMON ERROR CODES:
  E404: 'storage/object-not-found',
};
