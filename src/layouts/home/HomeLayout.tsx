import { ComponentProps } from 'react';
import { Header } from './components/Header';

interface Props extends ComponentProps<'main'> {}

export function HomeLayout(props: Props) {
  const { children, ...restProps } = props;

  return (
    <main {...restProps}>
      <Header />
      {children}
    </main>
  );
}
