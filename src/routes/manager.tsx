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
        name: 'manager.login',
        path: 'login',
        component: './user/Login',
      },
    ],
  },
  {
    path: '/artists',
    name: 'manager.artists',
    icon: antize(MdOutlineManageAccounts),
    component: './Artists',
    hideChildrenInMenu: true,
    children: [
      {
        locale: 'menu.manager.artists.detail',
        name: 'manager.artists.detail',
        path: ':id',
        component: './Artists/detail',
      },
    ],
  },
  {
    path: '/boxes',
    name: 'manager.boxes',
    icon: antize(MdOutlineManageAccounts),
    component: './Boxes',
    hideChildrenInMenu: true,
    children: [
      {
        locale: 'menu.manager.boxes.detail',
        name: 'manager.boxes.detail',
        path: ':id',
        component: './Boxes/detail',
      },
    ],
  },
  {
    path: '/earns',
    name: 'manager.earns',
    icon: antize(MdOutlineManageAccounts),
    component: './Earns',
  },
  {
    path: '/box_invoices',
    name: 'manager.box_invoices',
    icon: antize(MdOutlineManageAccounts),
    component: './BoxInvoices',
  },
  {
    path: '/earn_invoices',
    name: 'manager.earn_invoices',
    icon: antize(MdOutlineManageAccounts),
    component: './EarnInvoices',
  },

  {
    path: '/',
    redirect: '/artists',
  },
  {
    component: './404',
  },
];
