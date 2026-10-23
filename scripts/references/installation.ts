// Installation policy is separate from package discovery: manifests provide
// names, engines, and peer ranges; this file describes how integrations use them.
import type { Locale } from './i18n.ts';
import type { PackageTarget } from './types.ts';

const DEV_PACKAGES = new Set([
  '@wvb/cli',
  '@wvb/config',
  '@wvb/electron-builder',
  '@wvb/electron-forge',
]);

const OPTIONAL_PEERS: Record<string, { subpath: string; names: string[] }[]> = {
  '@wvb/remote-aws': [
    { subpath: '/pulumi', names: ['@pulumi/aws', '@pulumi/pulumi'] },
    { subpath: '/cdk', names: ['aws-cdk-lib', 'constructs'] },
  ],
  '@wvb/remote-cloudflare': [
    { subpath: '/pulumi', names: ['@pulumi/cloudflare', '@pulumi/pulumi'] },
  ],
  '@wvb/electron-builder': [{ subpath: '', names: ['electron-builder'] }],
};

function npmCommands(packages: string[], dev: boolean): string {
  const args = `${dev ? '-D ' : ''}${packages.join(' ')}`;
  const commands = {
    npm: `npm install ${args}`,
    pnpm: `pnpm add ${args}`,
    yarn: `yarn add ${args}`,
  };
  return `<Tabs items={['npm', 'pnpm', 'yarn']}>\n${Object.entries(commands)
    .map(
      ([manager, command]) =>
        `  <Tab value="${manager}">\n\n\`\`\`sh\n${command}\n\`\`\`\n\n  </Tab>`
    )
    .join('\n')}\n</Tabs>\n\n`;
}

export function installationSection(pkg: PackageTarget, locale: Locale): string {
  const ko = locale === 'ko';
  let out = `## ${ko ? '설치' : 'Installation'}\n\n`;
  if (pkg.name !== pkg.packageName) {
    out += ko
      ? `\`${pkg.name}\`은 \`${pkg.packageName}\` 패키지의 하위 경로입니다. 설치할 때는 패키지 이름을 사용하세요.\n\n`
      : `\`${pkg.name}\` is an export subpath of \`${pkg.packageName}\`. Use the package name when installing it.\n\n`;
  }
  if (pkg.nodeVersion != null && pkg.nodeVersion !== '') {
    out += ko
      ? `Node.js 버전 요구사항: \`${pkg.nodeVersion}\`.\n\n`
      : `Node.js version requirement: \`${pkg.nodeVersion}\`.\n\n`;
  }
  if (pkg.registry === 'jsr') {
    out += ko
      ? '프로젝트에 JSR 패키지를 추가하세요:\n\n'
      : 'Add the JSR package to your project:\n\n';
    out += `\`\`\`sh\ndeno add jsr:${pkg.packageName}\n\`\`\`\n\n`;
    out += ko
      ? '실행할 플랫폼의 네이티브 라이브러리를 다운로드하세요:\n\n'
      : 'Download the native library for the platform you run on:\n\n';
    out += '```sh\ndeno run --allow-net --allow-read --allow-write @wvb/deno/install\n```\n\n';
    out += ko
      ? '라이브러리는 `.wvb/lib`에 저장됩니다. 실행 권한과 패키징 설정은 [Deno Desktop 가이드](/docs/guide/deno-desktop)를 참고하세요.\n\n'
      : 'The library is saved under `.wvb/lib`. For runtime permissions and packaging, see the [Deno Desktop guide](/docs/guide/deno-desktop).\n\n';
  } else {
    const dev = DEV_PACKAGES.has(pkg.packageName);
    out += ko
      ? `프로젝트에 ${dev ? '개발 ' : ''}의존성으로 추가하세요:\n\n`
      : `Add the package to your project's ${dev ? 'development dependencies' : 'dependencies'}:\n\n`;
    out += npmCommands([pkg.packageName], dev);
    const required = pkg.peers.filter(peer => !peer.optional);
    const optionalGroups = OPTIONAL_PEERS[pkg.packageName] ?? [];
    const groups = [
      { subpath: null, peers: required },
      ...optionalGroups
        .filter(
          group => pkg.name === pkg.packageName || pkg.name === `${pkg.packageName}${group.subpath}`
        )
        .map(group => ({
          subpath: group.subpath,
          peers: pkg.peers.filter(peer => group.names.includes(peer.name)),
        })),
    ];
    for (const group of groups) {
      if (group.peers.length === 0) continue;
      const context =
        group.subpath == null || group.subpath === ''
          ? ''
          : `\`${pkg.packageName}${group.subpath}\``;
      out += ko
        ? `${context ? `${context}을 사용할 때는 다음 의존성도` : '함께 사용하는 도구도'} 설치하세요:\n\n`
        : `${context ? `To use ${context}, also install` : 'Install the compatible host tools'}:\n\n`;
      out += npmCommands(
        group.peers.map(peer => JSON.stringify(`${peer.name}@${peer.version}`)),
        true
      );
    }
  }
  return out;
}
