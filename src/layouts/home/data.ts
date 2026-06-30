export const GITHUB_URL = 'https://github.com/webview-bundle/webview-bundle';
export const DOCS_URL = '/docs';

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Docs', href: DOCS_URL },
  { label: 'Demo', href: '#demo' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Platforms', href: '#platforms' },
  { label: 'Reference', href: '/docs/references' },
];

/** Files shown on the left ("your source") of the architecture diagram. */
export const SOURCE_FILES = ['app/main.tsx', 'styles/app.css', 'assets/*.png', 'package.json'];

export interface WebviewHost {
  platform: string;
  runtime: string;
}

/** Hosts shown on the right ("webview host") of the architecture diagram. */
export const WEBVIEW_HOSTS: WebviewHost[] = [
  { platform: 'Desktop', runtime: 'Electron / Tauri' },
  { platform: 'iOS', runtime: 'WKWebView' },
  { platform: 'Android', runtime: 'WebView' },
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
      "Every bundle carries its full asset graph and is served through a custom protocol — no network round-trip. Subway, plane, dead network, doesn't matter.",
    code: "webviewBundle({ protocols: [bundleProtocol('app')] });",
  },
  {
    number: '02',
    title: 'Written in web code.',
    description:
      'Author with React, Vue, Svelte, or vanilla HTML. wvb pack turns any bundler output into a single .wvb artifact — no custom toolchain to learn.',
    code: 'wvb pack ./dist --outfile app.wvb',
  },
  {
    number: '03',
    title: 'Cross-platform contract.',
    description:
      'One bundle format over one shared Rust core. Electron and Tauri run it today; iOS WKWebView and Android WebView are on the way. No per-host packaging branches.',
    code: '// One .wvb — Electron & Tauri today.',
  },
  {
    number: '04',
    title: 'Native where it matters.',
    description:
      'A typed IPC layer lets web code load bundles and pull over-the-air updates from the host. Native bindings for Swift and Kotlin are generated from the Rust core via UniFFI.',
    code: 'const info = await updater.getUpdate("app");',
  },
];

export interface Platform {
  name: string;
  planned?: boolean;
}

export const PLATFORMS: Platform[] = [
  { name: 'macOS' },
  { name: 'Windows' },
  { name: 'Linux' },
  { name: 'iOS', planned: true },
  { name: 'Android', planned: true },
];

export const INSTALL_COMMANDS = [
  'npm install -D @wvb/cli',
  'wvb pack ./dist --outfile app.wvb',
  'wvb serve .wvb/app.wvb',
];
