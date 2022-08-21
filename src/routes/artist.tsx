import { MenuDataItem } from '@ant-design/pro-layout';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { RouteObject } from 'react-router-dom';
import { antize } from '@/libs/icon';

export const routes: (MenuDataItem & RouteObject)[] = [
  {
    path: '',
    layout: false,
    children: [
      {
        name: 'login',
        path: 'login',
        component: './Login',
      },
    ],
  },
  {
    path: '/artist/home',
    name: 'artist.home',
    icon: antize(MdOutlineManageAccounts),
    component: './Artist/Home/index',
  },
  {
    path: '/',
    redirect: '/artist/index',
  },
  {
    component: './404',
  },
];
