export type ThemeId =
  | 'minimal'
  | 'ember'
  | 'black-blue'
  | 'black-white'
  | 'red-blue'
  | 'purple'
  | 'orange'
  | 'green'
  | 'pink'
  | 'blue-light'
  | 'dark'
  | 'custom';

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  tagline: string;
  swatch: [string, string, string];
  glow?: string;
  isLight?: boolean;
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'minimal',
    label: 'Minimal Dark',
    tagline: 'GO-PLAY style • Чистый минимализм и teal',
    swatch: ['#0a0a0b', '#5fd0bb', '#131316'],
    glow: 'rgba(95, 208, 187, 0.25)',
  },
  {
    id: 'ember',
    label: 'Ember Orange',
    tagline: 'Anime Launcher • Тёплый огонь и графит',
    swatch: ['#100904', '#FF7417', '#1A1009'],
    glow: 'rgba(255, 116, 23, 0.4)',
  },
  {
    id: 'black-blue',
    label: 'Black & Blue',
    tagline: 'Cyber AniDa • Оригинальный кибер-стиль',
    swatch: ['#060913', '#3b82f6', '#0f172a'],
    glow: 'rgba(59, 130, 246, 0.4)',
  },
  {
    id: 'purple',
    label: 'Tokyo Purple',
    tagline: 'Neon Eva • Неоновый Токио и Евангелион',
    swatch: ['#0a0614', '#a855f7', '#170f2b'],
    glow: 'rgba(168, 85, 247, 0.4)',
  },
  {
    id: 'red-blue',
    label: 'Red & Blue',
    tagline: 'Akira Cyber • Алый драйв и лазурный неон',
    swatch: ['#0d0a14', '#ef4444', '#1a1428'],
    glow: 'rgba(239, 68, 68, 0.4)',
  },
  {
    id: 'pink',
    label: 'Sakura Bloom',
    tagline: 'Cyber Sakura • Розовый лепесток и ночь',
    swatch: ['#120814', '#ec4899', '#221025'],
    glow: 'rgba(236, 72, 153, 0.4)',
  },
  {
    id: 'orange',
    label: 'Golden Shonen',
    tagline: 'Ember Flare • Горячий огонь сёнэна',
    swatch: ['#130a04', '#f97316', '#24140a'],
    glow: 'rgba(249, 115, 22, 0.4)',
  },
  {
    id: 'green',
    label: 'Matrix Mecha',
    tagline: 'Cyber Emerald • Высокотехнологичный мех',
    swatch: ['#041109', '#10b981', '#0b2416'],
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 'dark',
    label: 'Tokyo Midnight',
    tagline: 'Slate Night • Глубокая полуночная тень',
    swatch: ['#0b0d13', '#6366f1', '#151923'],
    glow: 'rgba(99, 102, 241, 0.4)',
  },
  {
    id: 'black-white',
    label: 'Manga OLED',
    tagline: 'Monochrome • Чистый контраст страниц манги',
    swatch: ['#050505', '#f8fafc', '#141414'],
    glow: 'rgba(255, 255, 255, 0.3)',
  },
  {
    id: 'blue-light',
    label: 'Blue Light',
    tagline: 'Day Magazine • Чистая дневная бумага',
    swatch: ['#f4f7fc', '#2563eb', '#ffffff'],
    glow: 'rgba(37, 99, 235, 0.25)',
    isLight: true,
  },
  {
    id: 'custom',
    label: 'Custom Studio',
    tagline: 'Своя палитра • Полный контроль цветов',
    swatch: ['#05070f', '#3b82f6', '#0f172a'],
    glow: 'rgba(59, 130, 246, 0.4)',
  },
];

export interface CustomPreset {
  name: string;
  bg: string;
  surface: string;
  surface2: string;
  primary: string;
}

export const CUSTOM_PRESETS: CustomPreset[] = [
  { name: 'Neon Cyber', bg: '#070913', surface: '#0f1629', surface2: '#16203a', primary: '#00f2fe' },
  { name: 'Eva-01', bg: '#0b0716', surface: '#170f2c', surface2: '#241743', primary: '#8b5cf6' },
  { name: 'Persona Red', bg: '#0e080b', surface: '#1c1016', surface2: '#2b1923', primary: '#ff1744' },
  { name: 'Sakura Night', bg: '#120814', surface: '#221025', surface2: '#331838', primary: '#f472b6' },
  { name: 'Nordic Frost', bg: '#0b111a', surface: '#131e2d', surface2: '#1b2c40', primary: '#38bdf8' },
  { name: 'Amber Sun', bg: '#120a04', surface: '#22140a', surface2: '#331e0f', primary: '#f59e0b' },
];
