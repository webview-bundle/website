export const GITHUB_URL = 'https://github.com/webview-bundle/webview-bundle';
export const DOCS_URL = '/docs';

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Docs', href: DOCS_URL },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Platforms', href: '#platforms' },
  { label: 'Reference', href: '/docs/cli' },
];

/** Files shown on the left ("your source") of the architecture diagram. */
export const SOURCE_FILES = ['app/main.tsx', 'styles/app.css', 'assets/*.png', 'package.json'];

export interface WebviewHost {
  platform: string;
  runtime: string;
}

/** Hosts shown on the right ("webview host") of the architecture diagram. */
export const WEBVIEW_HOSTS: WebviewHost[] = [
  { platform: 'iOS', runtime: 'WKWebView' },
  { platform: 'Android', runtime: 'WebView' },
  { platform: 'Desktop', runtime: 'Tauri / Electron' },
  { platform: 'RN', runtime: 'react-native-webview' },
];

export interface Feature {
  number: string;
  title: string;
  description: string;
  code: string;
}

export const FEATURES: Feature[] = [
  {
    number: '01',
    title: 'Offline-first, by default.',
    description:
      "Every bundle carries its full dependency graph. Mount it once and the app keeps working — subway, plane, dead network, doesn't matter.",
    code: 'await mount("app.wvb", { offline: true });',
  },
  {
    number: '02',
    title: 'Written in web code.',
    description:
      'Author with React, Vue, Svelte, or vanilla HTML. The build step emits a single .wvb artifact from any bundler output — no custom toolchain to learn.',
    code: 'wvb build ./dist --sign ed25519',
  },
  {
    number: '03',
    title: 'Cross-platform contract.',
    description:
      'One bundle format, identical runtime behavior on iOS WKWebView, Android WebView, Tauri, and Electron. No per-host packaging branches.',
    code: '// Same bundle. Every host.',
  },
  {
    number: '04',
    title: 'Native where it matters.',
    description:
      'A typed bridge exposes host capabilities to your web code. Streaming IPC with cancellation and backpressure, adapters for Swift, Kotlin, and Rust.',
    code: 'const result = await native.fs.read(path);',
  },
];

export const PLATFORMS = ['iOS', 'Android', 'macOS', 'Windows', 'Linux'];

export const INSTALL_COMMANDS = [
  'npm install -g webview-bundle',
  'wvb init my-app',
  'wvb build ./my-app --out app.wvb',
];
