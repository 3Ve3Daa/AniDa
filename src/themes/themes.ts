export type ThemeId =
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
  swatch: [string, string];
}

export const THEMES: ThemeMeta[] = [
  { id: 'black-blue', label: 'Black & Blue', swatch: ['#05070f', '#2f7bff'] },
  { id: 'black-white', label: 'Black & White', swatch: ['#0a0a0a', '#f5f5f5'] },
  { id: 'red-blue', label: 'Red & Blue', swatch: ['#e5484d', '#2f7bff'] },
  { id: 'purple', label: 'Purple', swatch: ['#0d0716', '#8b5cf6'] },
  { id: 'orange', label: 'Orange', swatch: ['#140b04', '#ff7a1a'] },
  { id: 'green', label: 'Green', swatch: ['#04120b', '#22c55e'] },
  { id: 'pink', label: 'Pink', swatch: ['#150810', '#ec4899'] },
  { id: 'blue-light', label: 'Blue Light', swatch: ['#eef4ff', '#2f7bff'] },
  { id: 'dark', label: 'Dark', swatch: ['#101014', '#9aa4b2'] },
  { id: 'custom', label: 'Custom', swatch: ['#05070f', '#2f7bff'] },
];
