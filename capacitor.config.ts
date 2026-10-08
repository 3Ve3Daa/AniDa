import type { CapacitorConfig } from '@capacitor/cli';

// Mobile-оболочка AniDa (Android/iOS, дока §16).
// Web-активы берутся из dist/ (результат `npm run build`).
const config: CapacitorConfig = {
  appId: 'com.anida.launcher',
  appName: 'AniDa',
  webDir: 'dist',
  backgroundColor: '#05070f',
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
