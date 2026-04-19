import { ComponentProps } from 'react';

interface Props extends ComponentProps<'header'> {}

export function Header(props: Props) {
  return (
    <header className="sticky top-0 z-40 h-12" {...props}>
      <div className="relative w-full backdrop-blur-lg border-b h-full flex items-center gap-2.5 p-4">
        <img alt="" src="/logo.png" width={32} />
        <h1 className="m-0 font-bold">WEBVIEW BUNDLE</h1>
      </div>
    </header>
  );
}
