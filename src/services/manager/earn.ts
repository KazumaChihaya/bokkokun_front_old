import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Artist } from './artist';
import { request } from '@/libs/request';

export type Store = {
  id: number;
  name: string;
};

export type Earn = {
  id: number;
  artist_id: number;
  date: string;
  store_id: number;
  code: string;
  money: number;

  artist?: Artist;
};
export type AddEarnParam = {
  artist_code: string;
  code: string;
  date: string;
  store_id: number;
  money: number | string;
};

const storesQueryKey = '/api/manager/store';
export const useStores = () => useQuery<Store[]>(storesQueryKey);

const earnsQueryKey = '/api/manager/earn';
const fetchEarns = (store_id: number, page: number) => fetch(earnsQueryKey+'?page='+page+'&store_id='+store_id).then((res) => res.json());
export const useEarns = (store_id: number, page: number) => useQuery<Earn[]>(['earns', store_id+'-'+page], () => fetchEarns(store_id, page), { keepPreviousData: true })

const earnsLengthQueryKey = '/api/manager/earn/length';
const fetchEarnsLength = (store_id: number) => fetch(earnsLengthQueryKey+'?store_id='+store_id).then((res) => res.json());
export const useEarnsLength = (store_id: number) => useQuery<number>(['earnslength', store_id], () => fetchEarnsLength(store_id), { keepPreviousData: true })

export const useCreateEarnMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: AddEarnParam) => {
      return request('/api/manager/earn', { method: 'post', data: data });
    },
    {
      onSuccess(res, data: AddEarnParam) {
        client.invalidateQueries('earns');
        client.invalidateQueries('earnslength');
      },
    },
  );
};