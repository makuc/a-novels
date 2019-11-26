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
  SELECTED_THEME_DARK_MODE: 'dark-mode',
  THEMES: ['indigo', 'purple'],

  // Authentication
  CURRENT_USER_KEY: 'user',

  SIDENAV_OPEN: 'sidenav-open',
  SIDENAV_MAXIMIZED: 'sidenav-maximized',
};

export const dbKeys = {
  STATS_DOC: '---STATS---',

  C_TAGS: 'tags',

  C_GENRES: 'genres',

  CUsers: 'users',

  C_NOVELS: 'novels',
  C_FAVS: 'favourites',
  C_Likes: 'likes',
  C_NOVELS_CHAPTERS: 'chapters',
  C_NOVELS_CHAPTERS_PUBLIC_DOC: '---PUBLIC---',
  C_NOVELS_CHAPTERS_PRIVATE_DOC: '---PRIVATE---',
  C_NOVELS_REVIEWS: 'reviews',

  C_STATS: 'stats',
  C_STATS_Reviews: 'reviews',
  C_STATS_Chapters: 'chapters',

  C_library: 'libraries',
  C_library_novels: 'novels',

  C_history: 'histories',
  C_history_novels: 'novels',
};

export const storageKeys = {
  BASIC_URL: 'https://firebasestorage.googleapis.com/v0/b/testing-192515.appspot.com/o/',

  NOVELS_COVER_PATH: 'novels',
  NOVELS_COVER_FULL: 'cover-full.jpg?alt=media',
  NOVELS_COVER_THUMBNAIL: 'cover-full.jpg?alt=media',
  NOVELS_COVER_ORIGINAL: 'cover-full.jpg',
  NOVELS_COVER_DEFAULT_NAME: 'default',

  GEN_URL: (base: string, ...data: string[]) => {
    return base + data.join('%2F');
  },

  // COMMON ERROR CODES:
  E404: 'storage/object-not-found',
};
