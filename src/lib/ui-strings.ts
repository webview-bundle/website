import { DOCS_URL, GITHUB_URL } from '../layouts/home/data';
import type { Locale } from './i18n';
import { localizeHref, useLocale } from './locale';

// All user-facing UI copy outside the MDX docs (header, landing page, footer,
// controls), per locale. Internal hrefs are stored un-prefixed and localized at
// render time by `useUiStrings`, so `/docs/guide` becomes `/ko/docs/guide` in Korean.
export interface UiStrings {
  sections: { label: string; href: string }[];
  nav: { label: string; href: string }[];
  hero: {
    titleA: string;
    titleB: string;
    titleC: string;
    subtitle: string;
    readGuide: string;
    github: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    subtitleBefore: string;
    subtitleAfter: string;
    mobile: string;
    desktop: string;
    chooseView: string;
  };
  features: { title: string; description: string }[];
  platforms: { eyebrow: string; matrix: string; planned: string; shipping: string };
  cta: { eyebrow: string; title: string };
  footer: { label: string; href: string }[];
  language: { select: string };
  menu: { open: string; close: string; github: string; theme: string; search: string };
}

const en: UiStrings = {
  sections: [
    { label: 'Guide', href: '/docs/guide' },
    { label: 'References', href: '/docs/references' },
    { label: 'Config', href: '/docs/config' },
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
      'A bundle format and runtime for delivering web resources to webview-mounted platforms like Electron and Tauri — signed, versioned, and offline-first.',
    readGuide: 'Read the guide',
    github: 'GitHub',
  },
  showcase: {
    eyebrow: 'Live demo',
    title: 'One bundle. Every webview.',
    subtitleBefore: 'The same signed ',
    subtitleAfter:
      ' — a Hacker News reader — running unmodified on Electron, Tauri, iOS, and Android.',
    mobile: 'Mobile',
    desktop: 'Desktop',
    chooseView: 'Choose showcase view',
  },
  features: [
    {
      title: 'Offline-first, by default.',
      description:
        "Every bundle carries its full asset graph and is served through a custom protocol — no network round-trip. Subway, plane, dead network, doesn't matter.",
    },
    {
      title: 'Written in web code.',
      description:
        'Author with React, Vue, Svelte, or vanilla HTML. wvb pack turns any bundler output into a single .wvb artifact — no custom toolchain to learn.',
    },
    {
      title: 'Cross-platform contract.',
      description:
        'One bundle format over one shared Rust core. Electron and Tauri run it today; iOS WKWebView and Android WebView are on the way. No per-host packaging branches.',
    },
    {
      title: 'Native where it matters.',
      description:
        'A typed IPC layer lets web code load bundles and pull over-the-air updates from the host. Native bindings for Swift and Kotlin are generated from the Rust core via UniFFI.',
    },
  ],
  platforms: {
    eyebrow: 'Targets',
    matrix: 'compatibility matrix →',
    planned: 'planned',
    shipping: 'shipping',
  },
  cta: { eyebrow: 'Start now', title: 'Three commands from build output to a served bundle.' },
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
};

const ko: UiStrings = {
  sections: [
    { label: '가이드', href: '/docs/guide' },
    { label: '레퍼런스', href: '/docs/references' },
    { label: '설정', href: '/docs/config' },
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
    titleA: '네이티브 속',
    titleB: '웹',
    titleC: '을 배포합니다.',
    subtitle:
      'Electron, Tauri처럼 웹뷰를 탑재한 플랫폼에 웹 리소스를 전달하는 번들 포맷이자 런타임입니다. 서명되고, 버전이 매겨지며, 오프라인 우선으로 동작합니다.',
    readGuide: '가이드 읽기',
    github: 'GitHub',
  },
  showcase: {
    eyebrow: '라이브 데모',
    title: '하나의 번들로 모든 웹뷰에서.',
    subtitleBefore: '서명된 동일한 ',
    subtitleAfter:
      ' 하나 — Hacker News 리더 — 가 Electron, Tauri, iOS, Android에서 수정 없이 동작합니다.',
    mobile: '모바일',
    desktop: '데스크톱',
    chooseView: '쇼케이스 화면 선택',
  },
  features: [
    {
      title: '기본이 오프라인 우선.',
      description:
        '모든 번들은 전체 자산 그래프를 담고 커스텀 프로토콜로 제공됩니다. 네트워크 왕복이 없습니다. 지하철이든 비행기든 네트워크가 끊겨도 상관없습니다.',
    },
    {
      title: '웹 코드로 작성.',
      description:
        'React, Vue, Svelte, 또는 순수 HTML로 작성하세요. wvb pack이 어떤 번들러 산출물이든 하나의 .wvb 아티팩트로 만들어 줍니다. 새 툴체인을 배울 필요가 없습니다.',
    },
    {
      title: '플랫폼을 아우르는 규약.',
      description:
        '공유 Rust 코어 위의 하나의 번들 포맷입니다. Electron과 Tauri가 지금 실행하며, iOS WKWebView와 Android WebView가 준비 중입니다. 호스트마다 패키징을 분기할 필요가 없습니다.',
    },
    {
      title: '필요한 곳에서 네이티브.',
      description:
        '타입이 지정된 IPC 계층으로 웹 코드가 번들을 불러오고 호스트에서 무선(OTA) 업데이트를 받습니다. Swift와 Kotlin용 네이티브 바인딩은 UniFFI로 Rust 코어에서 생성됩니다.',
    },
  ],
  platforms: {
    eyebrow: '지원 대상',
    matrix: '호환성 표 →',
    planned: '예정',
    shipping: '지원',
  },
  cta: {
    eyebrow: '지금 시작',
    title: '빌드 산출물에서 제공되는 번들까지, 세 개의 명령어면 됩니다.',
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
    sections: base.sections.map(fix),
    nav: base.nav.map(fix),
    footer: base.footer.map(fix),
  };
}
