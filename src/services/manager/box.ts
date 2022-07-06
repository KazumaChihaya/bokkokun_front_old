import { useQuery } from 'react-query';
import { ActiveBox, Artist, ReserveBox } from './artist';

// Artist
export type Box = {
  id: number;
  box_category_id: number;
  money: number;
  created_at: string;
  updated_at: string;

  status: string;
  artist?: Artist;
  box_category: BoxCategory;

  vacanted_on?: string;
  special_money?: number;

  active_box?: ActiveBox;
  reserve_box?: ReserveBox;
};

export type BoxDetail = Box & {
  aaa: string,
};

type BoxCategory = {
  id: number;
  code: string;
  created_at: string;
  updated_at: string;

  store: Store;
}

type Store = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}


const boxesQueryKey = '/api/manager/box';

export const useBoxes = () => useQuery<Box[]>(boxesQueryKey);

const boxQueryKey = '/api/manager/box/';
export const useBox = (id: number) => useQuery<Box>(boxQueryKey+id);