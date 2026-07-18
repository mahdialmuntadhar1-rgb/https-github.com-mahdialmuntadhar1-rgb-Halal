import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.kaniq.zawaj',
  appName: 'Zawaj',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
