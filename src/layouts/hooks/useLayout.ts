import { ProSettings } from '@ant-design/pro-layout';
import { ConfigProvider } from 'antd';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useLocalStorage } from 'react-use';

export const LAYOUT_STORAGE_KEY = 'VITE_ANT_DESIGN_PRO_LAYOUT';

const initialState: ProSettings & {
  locale?: 'en-US';
  siderWidth?: number;
  pwa?: boolean;
  logo?: string;
} = {
  locale: 'ja-JP' as 'en-US', // layout typing hack!!
  siderWidth: 208,
  navTheme: 'light',
  fixedHeader: false,
  colorWeak: false,

  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixSiderbar: false,
  iconfontUrl: '',
  headerHeight: 48,
  splitMenus: false,

  title: 'BOKCOM',
  pwa: false,
  logo: '/logo.png',
};

export const useLayout = () => {
  const [local, ...rest] = useLocalStorage(LAYOUT_STORAGE_KEY, initialState);

  const queryClient = useQueryClient();

  useEffect(() => {
    ConfigProvider.config({
      theme: {
        primaryColor: local?.primaryColor,
      },
    });
    queryClient.setQueryData([LAYOUT_STORAGE_KEY], () => {
      return local;
    });
  }, [local, queryClient]);

  const { data } = useQuery([LAYOUT_STORAGE_KEY], {
    select: (data) => data,
    initialData: () => local,
    enabled: false,
  });

  return [data ?? initialState, ...rest] as const;
};
