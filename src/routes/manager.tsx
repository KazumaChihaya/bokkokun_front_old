import { MenuDataItem } from '@ant-design/pro-layout';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { RouteObject } from 'react-router-dom';
import { antize } from '@/libs/icon';

export const routes: (MenuDataItem & RouteObject)[] = [
  {
    path: '/manager',
    layout: false,
    children: [
      {
        name: 'manager.login',
        path: 'login',
        component: './Manager/Login',
      },
    ],
  },
  {
    path: '/manager/artists',
    name: 'manager.artists',
    icon: antize(MdOutlineManageAccounts),
    component: './Manager/Artists',
    hideChildrenInMenu: true,
    children: [
      {
        locale: 'menu.manager.artists.detail',
        name: 'manager.artists.detail',
        path: ':id',
        component: './Manager/Artists/detail',
      },
    ],
  },
  {
    path: '/manager/boxes',
    name: 'manager.boxes',
    icon: antize(MdOutlineManageAccounts),
    component: './Manager/Boxes',
    hideChildrenInMenu: true,
    children: [
      {
        locale: 'menu.manager.boxes.detail',
        name: 'manager.boxes.detail',
        path: ':id',
        component: './Manager/Boxes/detail',
      },
    ],
  },
  {
    path: '/manager/earns',
    name: 'manager.earns',
    icon: antize(MdOutlineManageAccounts),
    component: './Manager/Earns',
  },
  {
    path: '/manager/box_invoices',
    name: 'manager.box_invoices',
    icon: antize(MdOutlineManageAccounts),
    component: './Manager/BoxInvoices',
  },
  {
    path: '/manager/earn_invoices',
    name: 'manager.earn_invoices',
    icon: antize(MdOutlineManageAccounts),
    component: './Manager/EarnInvoices',
  },

  {
    path: '/',
    redirect: '/manager/artists',
  },
  {
    component: './404',
  },
];
