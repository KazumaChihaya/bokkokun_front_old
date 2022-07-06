import { MenuDataItem } from '@ant-design/pro-layout';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { RouteObject } from 'react-router-dom';
import { antize } from '@/libs/icon';

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
    path: '/manager/artists',
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
    path: '/manager/boxes',
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
    path: '/box_invoices',
    name: 'box_invoices',
    icon: antize(MdOutlineManageAccounts),
    component: './BoxInvoices',
  },
  {
    path: '/earn_invoices',
    name: 'earn_invoices',
    icon: antize(MdOutlineManageAccounts),
    component: './EarnInvoices',
  },
  {
    path: '/earn_invoices',
    name: 'earn_invoices',
    icon: antize(MdOutlineManageAccounts),
    component: './EarnInvoices',
  },

  {
    path: '/',
    redirect: '/manager/artists',
  },
  {
    component: './404',
  },
];
