import { request } from '@/libs/request';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Artist } from './artist';

export type Pool = {
  id: number;
  artist_id: number;
  date: string;
  money: number;
  created_at: string;
  updated_at: string;

  artist?: Artist;
};

export type AddPoolParam = {
  artist_id: number;
  date: string;
  money: number;
}
export type EditPoolParam = {
  pool_id: number;
  artist_id: number;
  date: string;
  money: number;
}
export type DeletePoolParam = {
  pool_id: number;
  artist_id: number;
}



const poolQueryKey = '/api/manager/pool/';
const poolCalcQueryKey = '/api/manager/pool/calc/';
export const usePool = (artist_id: number) => useQuery<Pool>(poolQueryKey+artist_id);
export const usePoolCalc = (artist_id: number) => useQuery<Pool>(poolCalcQueryKey+artist_id);

export const useCreatePoolMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: AddPoolParam) => {
      return request('/api/manager/pool', { method: 'post', data: data });
    },
    {
      onSuccess(res, data: AddPoolParam) {
        client.invalidateQueries(poolQueryKey+data.artist_id);
        client.invalidateQueries(poolCalcQueryKey+data.artist_id);
      },
    },
  );
};

export const useEditPoolMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: EditPoolParam) => {
      return request('/api/manager/pool', { method: 'patch', data: data });
    },
    {
      onSuccess(res, data: EditPoolParam) {
        client.invalidateQueries(poolQueryKey+data.artist_id);
        client.invalidateQueries(poolCalcQueryKey+data.artist_id);
      },
    },
  );
};

export const useDeletePoolMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: DeletePoolParam) => {
      return request('/api/manager/pool', { method: 'delete', data: data });
    },
    {
      onSuccess(res, data: DeletePoolParam) {
        client.invalidateQueries(poolQueryKey+data.artist_id);
        client.invalidateQueries(poolCalcQueryKey+data.artist_id);
      },
    },
  );
};