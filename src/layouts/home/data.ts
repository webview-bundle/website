export const GITHUB_URL = 'https://github.com/webview-bundle/webview-bundle';
export const DOCS_URL = '/docs/guide/getting-started';

/** Files shown on the left ("your source") of the architecture diagram. */
export const SOURCE_FILES = ['app/main.tsx', 'styles/app.css', 'assets/*.png', 'package.json'];

export interface WebviewHost {
  platform: string;
  runtime: string;
}

/** Hosts shown on the right ("webview host") of the architecture diagram. */
export const WEBVIEW_HOSTS: WebviewHost[] = [
  { platform: 'Desktop', runtime: 'Electron / Tauri / Deno Desktop' },
  { platform: 'iOS', runtime: 'WKWebView' },
  { platform: 'Android', runtime: 'WebView' },
];

export interface Platform {
  name: string;
  experimental?: boolean;
}

export const PLATFORMS: Platform[] = [
  { name: 'Electron' },
  { name: 'Tauri' },
  { name: 'Android' },
  { name: 'iOS' },
  { name: 'Deno Desktop', experimental: true },
];

export const INSTALL_COMMANDS = [
  'npm install -D @wvb/cli',
  'wvb pack ./dist --outfile app.wvb',
  'wvb serve .wvb/app.wvb',
];
