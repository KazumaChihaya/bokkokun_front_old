import jaJP from './ja-JP';
import { useEffect, useState } from 'react';
import { IntlProvider as Provider } from 'react-intl';
import type { PropsWithChildren } from 'react';
import { useLayout } from '@/layouts';

export * from './components/SelectLang';

export default function IntlProvider({ children }: PropsWithChildren<any>) {
  const [{ locale }] = useLayout();
  const [message, setMessage] = useState(jaJP);

  useEffect(() => {
    import(`../locales/${locale}.ts`).then((module) => {
      setMessage(module.default);
    });
  }, [locale]);

  return (
    <Provider messages={message} defaultLocale="ja-JP" locale="ja-JP">
      {children}
    </Provider>
  );
}
