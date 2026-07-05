import { DOCS_URL, GITHUB_URL } from '../layouts/home/data';
import type { Locale } from './i18n';
import { localizeHref, useLocale } from './locale';

// All user-facing UI copy outside the MDX docs (header, landing page, footer,
// controls), per locale. Internal hrefs are stored un-prefixed and localized at
// render time by `useUiStrings`, so `/docs/guide` becomes `/ko/docs/guide` in Korean.
export interface UiStrings {
  sections: { label: string; href: string; match?: string }[];
  nav: { label: string; href: string }[];
  hero: {
    titleA: string;
    titleB: string;
    titleC: string;
    subtitle: string;
    getStarted: string;
    github: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    subtitle: string;
    mobile: string;
    desktop: string;
    chooseView: string;
  };
  features: { title: string; description: string }[];
  platforms: { eyebrow: string; matrix: string; experimental: string };
  cta: { eyebrow: string; title: string; getStarted: string; github: string };
  footer: { label: string; href: string }[];
  language: { select: string };
  menu: { open: string; close: string; github: string; theme: string; search: string };
  changelog: {
    title: string;
    subtitle: string;
    allPackages: string;
    filterLabel: string;
    searchPlaceholder: string;
    searchLabel: string;
    noResults: string;
    noReleases: string;
    empty: string;
    viewRelease: string;
    latest: string;
    versioningNote: string;
    bundleFormatLink: string;
  };
  notFound: { title: string; message: string; home: string; docs: string };
}

const en: UiStrings = {
  sections: [
    { label: 'Guide', href: '/docs/guide/getting-started', match: '/docs/guide' },
    { label: 'References', href: '/docs/references' },
    { label: 'Changelog', href: '/docs/changelog' },
  ],
  nav: [
    { label: 'Docs', href: DOCS_URL },
    { label: 'Demo', href: '#demo' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Platforms', href: '#platforms' },
    { label: 'Reference', href: '/docs/references' },
  ],
  hero: {
    titleA: 'Ship web',
    titleB: 'inside',
    titleC: 'native.',
    subtitle:
      'Webview Bundle is an offline-first distributing system for web applications on webview-based frameworks and platforms.',
    getStarted: 'Get Started',
    github: 'GitHub',
  },
  showcase: {
    eyebrow: 'Showcase',
    title: 'One webview bundle. Every webview.',
    subtitle: 'Run a web application packaged as a WebView bundle on any WebView host.',
    mobile: 'Mobile',
    desktop: 'Desktop',
    chooseView: 'Choose showcase view',
  },
  features: [
    {
      title: 'Offline-first, by default',
      description:
        'The native host intercepts each webview request and reads the response straight from the webview bundle — no network round-trip. Subway, plane, dead network: it still loads.',
    },
    {
      title: 'Written in web code',
      description:
        'Author with React, Vue, Svelte, or plain HTML. Package it as a webview bundle and it runs in every native environment. No new toolchain to learn.',
    },
    {
      title: 'One format, every webview',
      description:
        'One .wvb format over one shared Rust core. Electron and Tauri run it today; Android and iOS through native bindings; Deno Desktop experimentally. No per-host packaging branches.',
    },
    {
      title: 'Over-the-air',
      description:
        'Update the webview bundle remotely, with no native release. Pull updates over the air whenever you choose.',
    },
  ],
  platforms: {
    eyebrow: 'Supported',
    matrix: 'compatibility matrix →',
    experimental: 'Experimental',
  },
  cta: {
    eyebrow: 'Start building',
    title: 'Write it once. Run it in every webview. Update it over the air.',
    getStarted: 'Get started',
    github: 'GitHub',
  },
  footer: [
    { label: 'docs', href: DOCS_URL },
    { label: 'github', href: GITHUB_URL },
    { label: 'discussions', href: `${GITHUB_URL}/discussions` },
    { label: 'changelog', href: `${GITHUB_URL}/releases` },
  ],
  language: { select: 'Select language' },
  menu: {
    open: 'Open menu',
    close: 'Close menu',
    github: 'GitHub repository',
    theme: 'Toggle theme',
    search: 'Search',
  },
  changelog: {
    title: 'Changelog',
    subtitle: 'Published releases, pulled per package from GitHub.',
    allPackages: 'All packages',
    filterLabel: 'Filter by package',
    searchPlaceholder: 'Search changelog…',
    searchLabel: 'Search the changelog',
    noResults: 'No releases match your filters.',
    noReleases: 'No releases have been published yet.',
    empty: "Couldn't load releases right now. Please try again later.",
    viewRelease: 'View release',
    latest: 'Latest',
    versioningNote:
      'Packages follow semantic versioning — pin exact versions for reproducible builds. The .wvb bundle format carries its own version (v1), independent of package versions.',
    bundleFormatLink: 'Bundle format',
  },
  notFound: {
    title: 'Page not found',
    message: "The page you're looking for doesn't exist or may have moved.",
    home: 'Go home',
    docs: 'Browse docs',
  },
};

const ko: UiStrings = {
  sections: [
    { label: '가이드', href: '/docs/guide/getting-started', match: '/docs/guide' },
    { label: '레퍼런스', href: '/docs/references' },
    { label: '변경 이력', href: '/docs/changelog' },
  ],
  nav: [
    { label: '문서', href: DOCS_URL },
    { label: '데모', href: '#demo' },
    { label: '동작 방식', href: '#how-it-works' },
    { label: '플랫폼', href: '#platforms' },
    { label: '레퍼런스', href: '/docs/references' },
  ],
  hero: {
    titleA: '웹을,',
    titleB: '네이티브에',
    titleC: '담다.',
    subtitle:
      '웹뷰 번들은 웹뷰 기반 프레임워크 및 플랫폼을 위한 오프라인 우선 방식의 웹 애플리케이션 배포 시스템입니다.',
    getStarted: '시작하기',
    github: 'GitHub',
  },
  showcase: {
    eyebrow: '쇼케이스',
    title: '하나의 웹뷰 번들로 모든 웹뷰에서.',
    subtitle: '웹뷰 번들로 패키징한 웹 애플리케이션을 모든 웹뷰 호스트에서 동작',
    mobile: '모바일',
    desktop: '데스크톱',
    chooseView: '쇼케이스 화면 선택',
  },
  features: [
    {
      title: '기본이 오프라인 우선',
      description:
        '네이티브 호스트가 웹뷰의 요청을 가로채 웹뷰 번들에서 바로 응답을 읽습니다. 네트워크 왕복이 없어 지하철이든 비행기든 네트워크가 끊겨도 화면이 뜹니다.',
    },
    {
      title: '웹 코드로 작성',
      description:
        'React, Vue, Svelte, 또는 순수 HTML로 작성하세요. 웹뷰 번들로 패키징한 파일은 모든 네이티브 환경에서 동작합니다. 새 툴체인을 배울 필요가 없습니다.',
    },
    {
      title: '하나의 포맷, 모든 웹뷰',
      description:
        '하나의 .wvb 포맷과 하나의 공유 Rust 코어. Electron과 Tauri가 지금 실행하며, Android와 iOS는 네이티브 바인딩으로, Deno Desktop은 실험적으로 지원됩니다. 호스트마다 패키징을 분기할 필요가 없습니다.',
    },
    {
      title: 'Over-The-Air',
      description:
        '네이티브 업데이트 없이 웹뷰 번들을 원격에서 업데이트하세요. 원하는 시점에 원격 업데이트를 받을 수 있습니다.',
    },
  ],
  platforms: {
    eyebrow: '지원 대상',
    matrix: '호환성 표 →',
    experimental: '실험적',
  },
  cta: {
    eyebrow: '시작하기',
    // `\n` forces the line break at the clause boundary (rendered as <br> in
    // CallToAction) so Korean never wraps mid-word ("웹뷰에|서").
    title: '한 번 작성해, 모든 웹뷰에서,\n원격으로 업데이트까지.',
    getStarted: '가이드 시작하기',
    github: 'GitHub',
  },
  footer: [
    { label: '문서', href: DOCS_URL },
    { label: 'github', href: GITHUB_URL },
    { label: 'discussions', href: `${GITHUB_URL}/discussions` },
    { label: '변경 이력', href: `${GITHUB_URL}/releases` },
  ],
  language: { select: '언어 선택' },
  menu: {
    open: '메뉴 열기',
    close: '메뉴 닫기',
    github: 'GitHub 저장소',
    theme: '테마 전환',
    search: '검색',
  },
  changelog: {
    title: '변경 이력',
    subtitle: 'GitHub 릴리스에서 패키지별로 불러온 배포 이력입니다.',
    allPackages: '전체 패키지',
    filterLabel: '패키지로 필터',
    searchPlaceholder: '변경 이력 검색…',
    searchLabel: '변경 이력 검색',
    noResults: '조건에 맞는 릴리스가 없습니다.',
    noReleases: '아직 배포된 릴리스가 없습니다.',
    empty: '지금은 릴리스를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.',
    viewRelease: '릴리스 보기',
    latest: '최신',
    versioningNote:
      '패키지는 유의적 버전을 따릅니다. 재현 가능한 빌드를 위해 정확한 버전을 고정하세요. .wvb 번들 포맷은 패키지 버전과 별개로 자체 포맷 버전(v1)을 가집니다.',
    bundleFormatLink: '번들 포맷',
  },
  notFound: {
    title: '페이지를 찾을 수 없습니다',
    message: '요청하신 페이지가 없거나 이동되었을 수 있습니다.',
    home: '홈으로',
    docs: '문서 보기',
  },
};

const DICT: Record<Locale, UiStrings> = { en, ko };

// UI strings for the active locale, with all internal hrefs already localized.
export function useUiStrings(): UiStrings {
  const locale = useLocale();
  const base = DICT[locale];
  const fix = <T extends { href: string }>(item: T): T => ({
    ...item,
    href: localizeHref(item.href, locale),
  });
  return {
    ...base,
    sections: base.sections.map(section => ({
      ...fix(section),
      // `match` (active-state prefix) is localized like `href` when present.
      match: section.match != null ? localizeHref(section.match, locale) : undefined,
    })),
    nav: base.nav.map(fix),
    footer: base.footer.map(fix),
  };
}
