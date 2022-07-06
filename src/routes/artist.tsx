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
    path: '/artist/artists',
    name: 'artist.artists',
    icon: antize(MdOutlineManageAccounts),
    component: './Artist/Artists',
    hideChildrenInMenu: true,
    children: [
      {
        locale: 'menu.artist.artists.detail',
        name: 'artist.artists.detail',
        path: ':id',
        component: './Artist/Artists/detail',
      },
    ],
  },
  {
    path: '/artist/boxes',
    name: 'artist.boxes',
    icon: antize(MdOutlineManageAccounts),
    component: './Artist/Boxes',
    hideChildrenInMenu: true,
    children: [
      {
        locale: 'menu.artist.boxes.detail',
        name: 'artist.boxes.detail',
        path: ':id',
        component: './Artist/Boxes/detail',
      },
    ],
  },
  {
    path: '/artist/earns',
    name: 'artist.earns',
    icon: antize(MdOutlineManageAccounts),
    component: './Artist/Earns',
  },
  {
    path: '/artist/box_invoices',
    name: 'artist.box_invoices',
    icon: antize(MdOutlineManageAccounts),
    component: './Artist/BoxInvoices',
  },
  {
    path: '/artist/earn_invoices',
    name: 'artist.earn_invoices',
    icon: antize(MdOutlineManageAccounts),
    component: './Artist/EarnInvoices',
  },

  {
    path: '/',
    redirect: '/artist/artists',
  },
  {
    component: './404',
  },
];
