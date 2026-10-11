export type SiteCategory = 'anime' | 'manga' | 'dub' | 'new' | 'popular';

export interface AnimeSite {
  id: string;
  name: string;
  description: string;
  url: string;
  /** Origin стартового URL (scheme + host + port), напр. https://ru.yummyani.me */
  origin: string;
  /** Разрешённые origin для внутренней навигации (сравниваются целиком, не startsWith). */
  allowedOrigins: string[];
  category: SiteCategory[];
  logoText: string;
  /** Путь к логотипу в public/logos (относительный — работает в web, Electron и Capacitor). */
  logo?: string;
  accent?: string;
  featured?: boolean;
  tags?: string[];
}

/** Origin строки через нормальный URL-парсер. */
export function originOf(raw: string): string | null {
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

/**
 * Разрешена ли навигация на rawUrl внутри сайта:
 * origin целевого URL должен точно совпадать с одним из allowedOrigins.
 * Любые path/query/hash внутри разрешённого origin разрешены.
 */
export function isUrlAllowedForSite(rawUrl: string, site: AnimeSite): boolean {
  const origin = originOf(rawUrl);
  if (!origin) return false;
  return site.allowedOrigins.includes(origin);
}

// Данные сайтов хранятся отдельно от компонентов (дока §7, §17).
// Добавление нового сервиса = одна запись здесь, UI переписывать не нужно.
export const SITES: AnimeSite[] = [
  {
    id: 'anilibria',
    name: 'AniLibria',
    description: 'Озвучка и каталог аниме от команды AniLibria.',
    url: 'https://anilibria.tv/',
    origin: 'https://anilibria.tv',
    allowedOrigins: ['https://anilibria.tv'],
    category: ['anime', 'dub', 'popular'],
    logoText: 'AL',
    logo: 'logos/anilibria.jpg',
    featured: true,
    tags: ['озвучка', 'каталог'],
  },
  {
    id: 'anilibria-tv',
    name: 'AniLibria TV',
    description: 'Зеркало и плеер AniLibria TV для просмотра.',
    url: 'https://anilibria.top/',
    origin: 'https://anilibria.top',
    allowedOrigins: ['https://anilibria.top', 'https://www.aniliberty.top'],
    category: ['anime', 'dub'],
    logoText: 'TV',
    logo: 'logos/anilibria-tv.jpg',
    tags: ['плеер', 'зеркало'],
  },
  {
    id: 'yummy',
    name: 'YummyAnime',
    description: 'Аниме-платформа с каталогом и онгоингами.',
    url: 'https://ru.yummyani.me/',
    origin: 'https://ru.yummyani.me',
    allowedOrigins: ['https://ru.yummyani.me'],
    category: ['anime', 'popular', 'new'],
    logoText: 'YA',
    logo: 'logos/yummy.jpg',
    featured: true,
    tags: ['онгоинги', 'каталог'],
  },
  {
    id: 'jutsu',
    name: 'Jut.su',
    description: 'Популярный каталог аниме с русской озвучкой.',
    url: 'https://jut-su.net/',
    origin: 'https://jut-su.net',
    allowedOrigins: ['https://jut-su.net'],
    category: ['anime', 'dub', 'popular'],
    logoText: 'JS',
    logo: 'logos/jutsu.jpg',
    featured: true,
    tags: ['озвучка'],
  },
  {
    id: 'kinogo',
    name: 'Kinogo Anime',
    description: 'Раздел аниме на Kinogo: фильмы и сериалы.',
    url: 'https://loft.kinogo.mu/anime/',
    origin: 'https://loft.kinogo.mu',
    allowedOrigins: ['https://loft.kinogo.mu'],
    category: ['anime', 'new'],
    logoText: 'KG',
    tags: ['фильмы'],
  },
  {
    id: 'shikimori',
    name: 'Shikimori',
    description: 'Энциклопедия аниме и манги, списки и рейтинги.',
    url: 'https://shikimori.one/animes',
    origin: 'https://shikimori.one',
    allowedOrigins: ['https://shikimori.one'],
    category: ['anime', 'manga', 'popular'],
    logoText: 'SH',
    logo: 'logos/shikimori.png',
    featured: true,
    tags: ['энциклопедия', 'манга'],
  },
  {
    id: 'animego',
    name: 'AnimeGO',
    description: 'Каталог аниме с расписанием онгоингов.',
    url: 'https://animego.org/',
    origin: 'https://animego.org',
    allowedOrigins: ['https://animego.org'],
    category: ['anime', 'new'],
    logoText: 'GO',
    logo: 'logos/animego.png',
    tags: ['онгоинги'],
  },
  {
    id: 'anixart',
    name: 'Anixart',
    description: 'Мобильно-ориентированный каталог аниме.',
    url: 'https://anixart.tv/',
    origin: 'https://anixart.tv',
    allowedOrigins: ['https://anixart.tv'],
    category: ['anime', 'new'],
    logoText: 'AX',
    logo: 'logos/anixart.png',
    tags: ['каталог'],
  },
  {
    id: 'animeon',
    name: 'AnimeOn',
    description: 'Онлайн-кинотеатр аниме с каталогом и поиском.',
    url: 'https://animeon.cc/',
    origin: 'https://animeon.cc',
    allowedOrigins: ['https://animeon.cc'],
    category: ['anime', 'new'],
    logoText: 'AO',
    logo: 'logos/animeon.jpg',
    tags: ['каталог', 'онлайн'],
  },
];

export const CATEGORIES: { id: string; label: string; match: SiteCategory | 'all' | 'favorites' }[] = [
  { id: 'all', label: 'Все', match: 'all' },
  { id: 'popular', label: 'Популярные', match: 'popular' },
  { id: 'favorites', label: 'Избранное', match: 'favorites' },
  { id: 'anime', label: 'Аниме', match: 'anime' },
  { id: 'manga', label: 'Манга', match: 'manga' },
  { id: 'dub', label: 'Озвучки', match: 'dub' },
  { id: 'new', label: 'Новинки', match: 'new' },
];

export const ALLOWED_HOSTS = [
  'anilibria.tv',
  'anilibria.top',
  'yummyani.me',
  'ru.yummyani.me',
  'jut-su.net',
  'jut.su',
  'kinogo.mu',
  'loft.kinogo.mu',
  'shikimori.one',
  'shikimori.me',
  'animego.org',
  'anixart.tv',
  'animeon.cc',
];

export function isAllowedUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    return ALLOWED_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}
