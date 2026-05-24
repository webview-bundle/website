import { ComponentProps } from 'react';

interface LogoProps extends Omit<ComponentProps<'img'>, 'src' | 'alt'> {}

export function Logo({ width = 28, height = 28, className, ...props }: LogoProps) {
  return (
    <img
      src="/logo3.png"
      alt="Webview Bundle logo"
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
}
