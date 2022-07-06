import styles from './index.module.less';
import HeaderDropdown from '../HeaderDropdown';
import React, { useCallback } from 'react';
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  useLogoutMutation,
  useSession,
} from '@/services/arrow-manage/auth';

export interface GlobalHeaderRightProps {
  menu?: boolean;
}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: currentUser, isLoading } = useSession();

  const { mutate: logout } = useLogoutMutation();

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await logout();
    const { search, pathname } = location;
    // Note: There may be security issues, please note
    if (
      window.location.pathname !== '/user/login' &&
      !searchParams.has('redirect')
    ) {
      navigate(
        `/user/login?${createSearchParams({
          redirect: pathname + search,
        }).toString()}`,
        {
          replace: true,
        },
      );
    }
  };

  const onMenuClick = useCallback((event: any) => {
    const { key } = event;
    if (key === 'logout') {
      loginOut();
      return;
    }
    navigate(`/account/${key}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (isLoading) return loading;

  if (!currentUser || !currentUser.manager?.name) return loading;

  const menuHeaderDropdown = (
    <Menu
      className={styles.menu}
      selectedKeys={[]}
      onClick={onMenuClick}
      items={[
        {
          key: 'center',
          icon: <UserOutlined />,
          label: 'アカウント',
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: '個人設定',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'ログアウト',
        },
      ]}
    />
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <span className={`${styles.name} anticon`}>
          {currentUser.manager?.name}
        </span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
