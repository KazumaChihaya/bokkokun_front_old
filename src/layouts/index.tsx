import { useLayout } from './hooks';
import RightContent from './components/RightContent';
import Footer from './components/Footer';
import Layout from 'virtual:antd-layout';
import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes as manager_routes } from '@/routes/manager';
import { routes as artist_routes } from '@/routes/artist';
import { useIntl } from 'react-intl';
import { useSession } from '@/services/arrow-manage/auth';
import React, { useEffect, useState } from 'react';
import { TransitionChildren } from 'react-transition-group/Transition';
import { CustomTitleContext, CustomTitleData } from './hooks/useCustomTitle';
import { isEqual } from 'lodash-es';
import FadeTransition from '@/components/FadeTransition';

export * from './hooks';

export default function LayoutWrapper() {
  const { data: session, isFetching, isLoading } = useSession();

  const [layout] = useLayout();

  const location = useLocation();
  const navigate = useNavigate();

  const intl = useIntl();

  useEffect(() => {
    // 未ログイン時は強制的にログインページへ移動
    if (!isFetching && (session?.status ?? 'ng') != 'ok' && location.pathname !== '/manager/login') {
      requestAnimationFrame(() => {
        navigate('/manager/login');
      });
    }
  });

  // custom title
  const [titleState, setTitleState] = useState([
    {} as CustomTitleData,
    location.pathname,
  ] as const);
  const setCustomTitle = (title: CustomTitleData) => {
    if (!isEqual(titleState[0], title)) {
      setTitleState([title, location.pathname]);
    }
  };

  useEffect(() => {
    if (titleState[1] !== location.pathname) {
      setTitleState([{}, location.pathname]);
    }
  }, [titleState, location.pathname]);

  return (
    <Layout
      /*
      onOpenChange={(keys: string[]) => {
        console.log(keys);
      }}
      */
      openKeys={[]}
      routes={session?.type == 'manager' ? manager_routes : artist_routes}
      rightContentRender={() => <RightContent />}
      disableContentMargin={false}
      footerRender={() => <Footer />}
      formatMessage={intl.formatMessage}
      fixSiderbar={true}
      // 自定义 403 页面
      // unAccessible: <div>unAccessible</div>,
      // 增加一个 loading 的状态
      childrenRender={(children: React.ReactNode) => {
        if (isLoading) return <PageLoading />;
        return location.pathname.indexOf('login') !== -1 ? (
          children
        ) : (
          <PageContainer {...titleState[0]}>
            <FadeTransition transitionKey={location.pathname}>
              <CustomTitleContext.Provider value={setCustomTitle}>
                {children as TransitionChildren}
              </CustomTitleContext.Provider>
            </FadeTransition>
          </PageContainer>
        );
      }}
      {...layout}
    ></Layout>
  );
}
