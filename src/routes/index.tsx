import { MenuDataItem } from '@ant-design/pro-layout';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { RouteObject } from 'react-router-dom';
import { antize } from '../libs/icon';

export const routes: (MenuDataItem & RouteObject)[] = [
  {
    path: '/user',
    layout: false,
    children: [
      {
        name: 'login',
        path: 'login',
        component: './user/Login',
      },
    ],
  },
  {
    path: '/artists',
    name: 'artists',
    icon: antize(MdOutlineManageAccounts),
    component: './Artists',
    hideChildrenInMenu: true,
    children: [
      {
        locale: 'menu.artists.detail',
        name: 'artists.detail',
        path: ':id',
        component: './Artists/detail',
      },
    ],
  },
  {
    path: '/boxes',
    name: 'boxes',
    icon: antize(MdOutlineManageAccounts),
    component: './Boxes',
    hideChildrenInMenu: true,
    children: [
      {
        locale: 'menu.boxes.detail',
        name: 'boxes.detail',
        path: ':id',
        component: './Boxes/detail',
      },
    ],
  },
  {
    path: '/earns',
    name: 'earns',
    icon: antize(MdOutlineManageAccounts),
    component: './Earns',
  },

  {
    path: '/',
    redirect: '/artists',
  },
  {
    component: './404',
  },
];
